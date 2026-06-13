const prisma = require('../db');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const verificarAcceso = async (usuarioId, solicitudId) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id: Number(solicitudId) },
    include: {
      banda: { include: { usuario: true } },
      organizador: { include: { usuario: true } },
    },
  });
  if (!solicitud) {
    const err = new Error('Solicitud no encontrada'); err.status = 404; throw err;
  }
  const esBanda = solicitud.banda.usuarioId === usuarioId;
  const esOrganizador = solicitud.organizador.usuarioId === usuarioId;
  if (!esBanda && !esOrganizador) {
    const err = new Error('No tienes acceso a esta solicitud'); err.status = 403; throw err;
  }
  return { solicitud, esBanda, esOrganizador };
};

const obtenerMensajes = async (usuarioId, solicitudId) => {
  await verificarAcceso(usuarioId, solicitudId);
  return prisma.mensaje.findMany({
    where: { solicitudId: Number(solicitudId) },
    orderBy: { fechaEnvio: 'asc' },
    include: { remitente: { select: { nombre: true } } },
  });
};

const enviarMensaje = async (usuarioId, solicitudId, contenido) => {
  const { solicitud, esBanda } = await verificarAcceso(usuarioId, solicitudId);

  if (['cancelada', 'rechazada'].includes(solicitud.estado)) {
    const err = new Error('No se pueden enviar mensajes en solicitudes canceladas o rechazadas');
    err.status = 409; throw err;
  }

  const mensaje = await prisma.mensaje.create({
    data: { solicitudId: Number(solicitudId), remitenteId: usuarioId, contenido },
    include: { remitente: { select: { nombre: true } } },
  });

  // Notificar al OTRO participante (no bloqueante)
  const destinatario = esBanda ? solicitud.organizador.usuario : solicitud.banda.usuario;
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: destinatario.correo,
    subject: 'Nuevo mensaje en SabaneraConnect',
    html: `<p>Tienes un nuevo mensaje en la solicitud #${solicitudId}.</p><p><em>${contenido}</em></p>`,
  }).catch(() => {});

  return mensaje;
};

module.exports = { obtenerMensajes, enviarMensaje };
