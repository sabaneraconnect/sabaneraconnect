const prisma = require('../db');
const { esEventoRealizado } = require('../utils/fechas');

const obtenerSolicitudCompleta = async (solicitudId) => {
  const s = await prisma.solicitud.findUnique({
    where: { id: Number(solicitudId) },
    include: {
      banda: { include: { usuario: true } },
      organizador: { include: { usuario: true } },
    },
  });
  if (!s) { const e = new Error('Solicitud no encontrada'); e.status = 404; throw e; }
  return s;
};

const crearResena = async (usuarioId, solicitudId, calificacion, comentario) => {
  const solicitud = await obtenerSolicitudCompleta(solicitudId);

  if (solicitud.organizador.usuarioId !== usuarioId) {
    const e = new Error('Solo el organizador puede dejar una reseña'); e.status = 403; throw e;
  }
  const pago = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  const pagado = pago && pago.estadoPagoUno === 'pagado';
  if (!esEventoRealizado(solicitud) && !pagado) {
    const e = new Error('La reseña se habilita una vez que el evento haya concluido o se haya realizado el pago'); e.status = 409; throw e;
  }
  const existente = await prisma.resena.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (existente) {
    const e = new Error('Ya existe una reseña para esta solicitud'); e.status = 409; throw e;
  }
  const cal = Number(calificacion);
  if (!Number.isInteger(cal) || cal < 1 || cal > 5) {
    const e = new Error('La calificación debe ser un entero entre 1 y 5'); e.status = 400; throw e;
  }
  if (comentario && comentario.length > 500) {
    const e = new Error('El comentario no puede superar los 500 caracteres'); e.status = 400; throw e;
  }

  return prisma.resena.create({
    data: {
      solicitudId: Number(solicitudId),
      organizadorId: solicitud.organizadorId,
      bandaId: solicitud.bandaId,
      calificacion: cal,
      comentario: comentario || null,
    },
  });
};

const responderResena = async (usuarioId, resenaId, respuesta) => {
  const resena = await prisma.resena.findUnique({
    where: { id: Number(resenaId) },
    include: { banda: { include: { usuario: true } } },
  });
  if (!resena) { const e = new Error('Reseña no encontrada'); e.status = 404; throw e; }
  if (resena.banda.usuarioId !== usuarioId) {
    const e = new Error('Solo la banda puede responder esta reseña'); e.status = 403; throw e;
  }
  if (resena.respuestaBanda !== null) {
    const e = new Error('La banda ya respondió esta reseña'); e.status = 409; throw e;
  }
  return prisma.resena.update({
    where: { id: Number(resenaId) },
    data: { respuestaBanda: respuesta },
  });
};

const obtenerResenasPorBanda = async (bandaId) => {
  const resenas = await prisma.resena.findMany({
    where: { bandaId: Number(bandaId) },
    orderBy: { fechaCreacion: 'desc' },
    include: { organizador: { include: { usuario: { select: { nombre: true } } } } },
  });

  const total = resenas.length;
  const promedio = total > 0 ? resenas.reduce((s, r) => s + r.calificacion, 0) / total : null;

  return {
    promedioEstrellas: promedio ? Math.round(promedio * 10) / 10 : null,
    total,
    resenas: resenas.map((r) => ({
      id: r.id,
      solicitudId: r.solicitudId,
      calificacion: r.calificacion,
      comentario: r.comentario,
      respuestaBanda: r.respuestaBanda,
      fechaCreacion: r.fechaCreacion,
      organizador: r.organizador.usuario.nombre,
    })),
  };
};

module.exports = { crearResena, responderResena, obtenerResenasPorBanda };
