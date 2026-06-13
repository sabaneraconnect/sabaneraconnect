const prisma = require('../db');
const Stripe = require('stripe');
const { Resend } = require('resend');
const { esEventoRealizado } = require('../utils/fechas');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const COMISION = 0.05;

const obtenerSolicitud = async (solicitudId) => {
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

const toCentavos = (monto) => Math.round(monto * 100);

const iniciarPago = async (usuarioId, solicitudId, tipo, porcentajeAnticipo) => {
  const solicitud = await obtenerSolicitud(solicitudId);

  if (solicitud.organizador.usuarioId !== usuarioId) {
    const e = new Error('Solo el organizador puede iniciar el pago'); e.status = 403; throw e;
  }
  if (solicitud.estado !== 'confirmada') {
    const e = new Error('La solicitud debe estar confirmada para iniciar el pago'); e.status = 409; throw e;
  }
  const existente = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (existente && existente.estadoPagoUno === 'pagado') {
    const e = new Error('El primer pago ya fue completado'); e.status = 409; throw e;
  }
  if (existente) {
    await prisma.pago.delete({ where: { id: existente.id } });
  }

  const tipoFinal = tipo === 'dividido' ? 'dividido' : 'completo';
  const pctAnticipo = tipoFinal === 'completo' ? 100 : Math.min(100, Math.max(1, Number(porcentajeAnticipo) || 50));
  const estadoPagoDos = tipoFinal === 'completo' ? 'no_aplica' : 'pendiente';
  const estadoPagoBandaDos = tipoFinal === 'completo' ? 'no_aplica' : 'pendiente';

  const montoTotal = solicitud.presupuesto;
  const comision = montoTotal * COMISION;
  const montoUno = montoTotal * pctAnticipo / 100;

  const intent = await stripe.paymentIntents.create({
    amount: toCentavos(montoUno),
    currency: 'cop',
    metadata: { solicitudId: String(solicitudId), pago: 'uno' },
  });

  const pago = await prisma.pago.create({
    data: {
      solicitudId: Number(solicitudId),
      montoTotal,
      comision,
      tipo: tipoFinal,
      porcentajeAnticipo: pctAnticipo,
      estadoPagoDos,
      estadoPagoBandaDos,
      stripePaymentIntentUno: intent.id,
    },
  });

  return { pago, clientSecret: intent.client_secret };
};

const confirmarPagoUno = async (usuarioId, solicitudId) => {
  const solicitud = await obtenerSolicitud(solicitudId);
  if (solicitud.organizador.usuarioId !== usuarioId) {
    const e = new Error('Acceso denegado'); e.status = 403; throw e;
  }
  const pago = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (!pago) { const e = new Error('Pago no encontrado'); e.status = 404; throw e; }

  const intent = await stripe.paymentIntents.retrieve(pago.stripePaymentIntentUno);
  if (intent.status !== 'succeeded') {
    const e = new Error('El pago aún no se ha completado en Stripe'); e.status = 402; throw e;
  }

  const ahora = new Date();
  const habilitacionDos = pago.tipo === 'dividido' && esEventoRealizado(solicitud) ? ahora : null;
  const montoUno = pago.montoTotal * pago.porcentajeAnticipo / 100;
  const montoTransferidoUno = montoUno * 0.95;

  return prisma.pago.update({
    where: { id: pago.id },
    data: {
      estadoPagoUno: 'pagado',
      fechaHabilitacionPagoDos: habilitacionDos,
      estadoPagoBandaUno: 'transferido',
      montoTransferidoUno,
    },
  });
};

const iniciarPagoDos = async (usuarioId, solicitudId) => {
  const solicitud = await obtenerSolicitud(solicitudId);
  if (solicitud.organizador.usuarioId !== usuarioId) {
    const e = new Error('Acceso denegado'); e.status = 403; throw e;
  }
  const pago = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (!pago) { const e = new Error('Pago no encontrado'); e.status = 404; throw e; }
  if (pago.estadoPagoDos === 'no_aplica') {
    const e = new Error('Este pago es completo, no tiene segundo cobro'); e.status = 409; throw e;
  }
  if (pago.estadoPagoDos === 'pagado') {
    const e = new Error('El segundo pago ya fue realizado'); e.status = 409; throw e;
  }
  const montoRestante = pago.montoTotal * (100 - pago.porcentajeAnticipo) / 100;
  const intent = await stripe.paymentIntents.create({
    amount: toCentavos(montoRestante),
    currency: 'cop',
    metadata: { solicitudId: String(solicitudId), pago: 'dos' },
  });

  const ahora = new Date();
  return {
    pago: await prisma.pago.update({
      where: { id: pago.id },
      data: {
        stripePaymentIntentDos: intent.id,
        fechaHabilitacionPagoDos: pago.fechaHabilitacionPagoDos ?? ahora,
      },
    }),
    clientSecret: intent.client_secret,
  };
};

const confirmarPagoDos = async (usuarioId, solicitudId) => {
  const solicitud = await obtenerSolicitud(solicitudId);
  if (solicitud.organizador.usuarioId !== usuarioId) {
    const e = new Error('Acceso denegado'); e.status = 403; throw e;
  }
  const pago = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (!pago || !pago.stripePaymentIntentDos) {
    const e = new Error('Pago dos no iniciado'); e.status = 404; throw e;
  }
  const intent = await stripe.paymentIntents.retrieve(pago.stripePaymentIntentDos);
  if (intent.status !== 'succeeded') {
    const e = new Error('El segundo pago aún no se ha completado en Stripe'); e.status = 402; throw e;
  }
  const montoRestante = pago.montoTotal * (100 - pago.porcentajeAnticipo) / 100;
  const montoTransferidoDos = montoRestante * 0.95;

  return prisma.pago.update({
    where: { id: pago.id },
    data: { estadoPagoDos: 'pagado', estadoPagoBandaDos: 'transferido', montoTransferidoDos },
  });
};

const obtenerPago = async (usuarioId, solicitudId) => {
  const solicitud = await obtenerSolicitud(solicitudId);
  const esBanda = solicitud.banda.usuarioId === usuarioId;
  const esOrganizador = solicitud.organizador.usuarioId === usuarioId;
  if (!esBanda && !esOrganizador) {
    const e = new Error('Acceso denegado'); e.status = 403; throw e;
  }

  const pago = await prisma.pago.findUnique({ where: { solicitudId: Number(solicitudId) } });
  if (!pago) return null;

  // Verificar 48h y notificar si aplica (no bloqueante)
  if (
    pago.fechaHabilitacionPagoDos &&
    pago.estadoPagoDos === 'pendiente' &&
    !pago.notificado48h
  ) {
    const horasTranscurridas = (new Date() - new Date(pago.fechaHabilitacionPagoDos)) / 3600000;
    if (horasTranscurridas > 48) {
      prisma.pago.update({ where: { id: pago.id }, data: { notificado48h: true } }).then(() => {
        resend.emails.send({
          from: 'onboarding@resend.dev',
          to: solicitud.organizador.usuario.correo,
          subject: 'Recordatorio: segundo pago pendiente en SabaneraConnect',
          html: `<p>Han pasado más de 48 horas desde que se habilitó el segundo pago de la solicitud #${solicitudId}. Por favor complétalo en SabaneraConnect.</p>`,
        }).catch(() => {});
      }).catch(() => {});
    }
  }

  return {
    ...pago,
    montoAnticipo: pago.montoTotal * pago.porcentajeAnticipo / 100,
    montoRestante: pago.tipo === 'completo' ? 0 : pago.montoTotal * (100 - pago.porcentajeAnticipo) / 100,
  };
};

module.exports = { iniciarPago, confirmarPagoUno, iniciarPagoDos, confirmarPagoDos, obtenerPago };
