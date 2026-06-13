const prisma = require('../db');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const minutosDesde = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const enviarCorreo = async (to, subject, html) => {
  try {
    await resend.emails.send({ from: 'onboarding@resend.dev', to, subject, html });
  } catch { /* no bloquea el flujo */ }
};

// ─── helpers ────────────────────────────────────────────────────────────────

const obtenerOrganizador = async (usuarioId) => {
  const org = await prisma.organizador.findUnique({
    where: { usuarioId },
    include: { usuario: { select: { nombre: true, correo: true } } },
  });
  if (!org) {
    const e = new Error('No tienes perfil de organizador.'); e.status = 403; throw e;
  }
  return org;
};

const obtenerBandaDelUsuario = async (usuarioId) => {
  const banda = await prisma.banda.findUnique({
    where: { usuarioId },
    include: { usuario: { select: { nombre: true, correo: true } } },
  });
  if (!banda) {
    const e = new Error('No tienes perfil de banda.'); e.status = 403; throw e;
  }
  return banda;
};

const obtenerSolicitudOr403 = async (solicitudId) => {
  const s = await prisma.solicitud.findUnique({
    where: { id: Number(solicitudId) },
    include: {
      banda: { select: { id: true, usuarioId: true, numeroCuenta: true, usuario: { select: { nombre: true, correo: true } } } },
      organizador: { include: { usuario: { select: { nombre: true, correo: true } } } },
    },
  });
  if (!s) { const e = new Error('Solicitud no encontrada.'); e.status = 404; throw e; }
  return s;
};

// ─── marcar / liberar franja ─────────────────────────────────────────────────

const marcarFranjaOcupada = async (bandaId, fechaISO, franjaInicio, franjaFin) => {
  const fechaDate = new Date(fechaISO);
  const inicio = new Date(fechaDate); inicio.setUTCHours(0, 0, 0, 0);
  const fin = new Date(fechaDate); fin.setUTCHours(23, 59, 59, 999);

  const existente = await prisma.disponibilidadBanda.findFirst({
    where: { bandaId, franjaInicio, franjaFin, fecha: { gte: inicio, lte: fin } },
  });

  if (existente) {
    await prisma.disponibilidadBanda.update({ where: { id: existente.id }, data: { estado: 'ocupado' } });
  } else {
    await prisma.disponibilidadBanda.create({
      data: { bandaId, fecha: fechaDate, franjaInicio, franjaFin, estado: 'ocupado' },
    });
  }
};

const liberarFranja = async (bandaId, fechaISO, franjaInicio, franjaFin) => {
  const fechaDate = new Date(fechaISO);
  const inicio = new Date(fechaDate); inicio.setUTCHours(0, 0, 0, 0);
  const fin = new Date(fechaDate); fin.setUTCHours(23, 59, 59, 999);

  const existente = await prisma.disponibilidadBanda.findFirst({
    where: { bandaId, franjaInicio, franjaFin, estado: 'ocupado', fecha: { gte: inicio, lte: fin } },
  });
  if (existente) {
    await prisma.disponibilidadBanda.update({ where: { id: existente.id }, data: { estado: 'disponible' } });
  }
};

// ─── casos de uso ────────────────────────────────────────────────────────────

const crearSolicitud = async (usuarioId, datos) => {
  const org = await obtenerOrganizador(usuarioId);
  const { bandaId, fecha, franjaInicio, franjaFin, municipio, tipoEvento, duracionHoras, presupuesto } = datos;

  if (minutosDesde(franjaInicio) >= minutosDesde(franjaFin)) {
    const e = new Error('La hora de inicio debe ser anterior a la hora de fin.'); e.status = 400; throw e;
  }
  const hoyStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  if (fecha.slice(0, 10) < hoyStr) {
    const e = new Error('La fecha no puede ser en el pasado.'); e.status = 400; throw e;
  }

  const banda = await prisma.banda.findUnique({
    where: { id: Number(bandaId) },
    include: { usuario: { select: { nombre: true, correo: true } } },
  });
  if (!banda) { const e = new Error('Banda no encontrada.'); e.status = 404; throw e; }

  const solicitud = await prisma.solicitud.create({
    data: {
      bandaId: Number(bandaId),
      organizadorId: org.id,
      fecha: new Date(fecha),
      franjaInicio,
      franjaFin,
      municipio,
      tipoEvento,
      duracionHoras: Number(duracionHoras),
      presupuesto: Number(presupuesto),
      estado: 'pendiente',
    },
  });

  const fechaStr = new Date(fecha).toLocaleDateString('es-CO', { dateStyle: 'long', timeZone: 'UTC' });
  await enviarCorreo(
    banda.usuario.correo,
    'Nueva solicitud de contratación — SabaneraConnect',
    `<p>Hola <strong>${banda.usuario.nombre}</strong>,</p>
     <p><strong>${org.usuario.nombre}</strong> ha enviado una solicitud de contratación para el <strong>${fechaStr}</strong> de ${franjaInicio} a ${franjaFin} en ${municipio} (${tipoEvento}).</p>
     <p>Presupuesto estimado: $${Number(presupuesto).toLocaleString('es-CO')}</p>
     <p>Ingresa a SabaneraConnect para aceptar, rechazar o hacer una contraoferta.</p>`,
  );

  return solicitud;
};

const obtenerSolicitud = async (usuarioId, solicitudId) => {
  const s = await obtenerSolicitudOr403(solicitudId);
  const esBanda = s.banda.usuarioId === usuarioId;
  const esOrganizador = s.organizador.usuarioId === usuarioId;
  if (!esBanda && !esOrganizador) {
    const e = new Error('No tienes acceso a esta solicitud.'); e.status = 403; throw e;
  }
  return s;
};

const listarPorOrganizador = async (usuarioId) => {
  const org = await obtenerOrganizador(usuarioId);
  return prisma.solicitud.findMany({
    where: { organizadorId: org.id },
    include: { banda: { include: { usuario: { select: { nombre: true } } } } },
    orderBy: { fechaCreacion: 'desc' },
  });
};

const listarPorBanda = async (usuarioId) => {
  const banda = await obtenerBandaDelUsuario(usuarioId);
  return prisma.solicitud.findMany({
    where: { bandaId: banda.id },
    include: { organizador: { include: { usuario: { select: { nombre: true } } } } },
    orderBy: { fechaCreacion: 'desc' },
  });
};

const ESTADOS_FINALES = ['confirmada', 'rechazada', 'cancelada'];

const responderSolicitud = async (usuarioId, solicitudId, accion, datos = {}) => {
  const s = await obtenerSolicitudOr403(solicitudId);

  if (s.banda.usuarioId !== usuarioId) {
    const e = new Error('Solo la banda puede responder esta solicitud.'); e.status = 403; throw e;
  }
  if (ESTADOS_FINALES.includes(s.estado)) {
    const e = new Error(`La solicitud ya está ${s.estado} y no puede modificarse.`); e.status = 409; throw e;
  }

  let nuevoEstado;
  let extraData = {};

  if (accion === 'aceptar') {
    nuevoEstado = 'confirmada';
    await marcarFranjaOcupada(s.bandaId, s.fecha.toISOString(), s.franjaInicio, s.franjaFin);
  } else if (accion === 'rechazar') {
    nuevoEstado = 'rechazada';
    await liberarFranja(s.bandaId, s.fecha.toISOString(), s.franjaInicio, s.franjaFin);
  } else if (accion === 'contraofertar') {
    nuevoEstado = 'en_negociacion';
    if (!datos.contraOferta) {
      const e = new Error('Se requiere contraOferta para esta acción.'); e.status = 400; throw e;
    }
    extraData.contraOferta = JSON.stringify(datos.contraOferta);
  } else {
    const e = new Error('Acción inválida. Use: aceptar, rechazar, contraofertar.'); e.status = 400; throw e;
  }

  const actualizada = await prisma.solicitud.update({
    where: { id: s.id },
    data: { estado: nuevoEstado, ...extraData },
  });

  const etiquetas = { confirmada: 'aceptada ✅', rechazada: 'rechazada ❌', en_negociacion: 'en negociación (contraoferta) 💬' };
  const fechaStr = s.fecha.toLocaleDateString('es-CO', { dateStyle: 'long', timeZone: 'UTC' });

  await enviarCorreo(
    s.organizador.usuario.correo,
    `Solicitud ${etiquetas[nuevoEstado] ?? nuevoEstado} — SabaneraConnect`,
    `<p>Hola <strong>${s.organizador.usuario.nombre}</strong>,</p>
     <p>Tu solicitud a <strong>${s.banda.usuario.nombre}</strong> para el <strong>${fechaStr}</strong> ha sido <strong>${etiquetas[nuevoEstado] ?? nuevoEstado}</strong>.</p>
     ${extraData.contraOferta ? `<p>Contraoferta: ${extraData.contraOferta}</p>` : ''}
     <p>Ingresa a SabaneraConnect para ver los detalles.</p>`,
  );

  return actualizada;
};

module.exports = { crearSolicitud, obtenerSolicitud, listarPorOrganizador, listarPorBanda, responderSolicitud };
