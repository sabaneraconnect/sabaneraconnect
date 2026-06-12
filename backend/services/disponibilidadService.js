const prisma = require('../db');

const obtenerBandaDelUsuario = async (usuarioId) => {
  const banda = await prisma.banda.findUnique({ where: { usuarioId } });
  if (!banda) {
    const error = new Error('Banda no encontrada para este usuario.');
    error.status = 404;
    throw error;
  }
  return banda;
};

const verificarPropiedad = async (usuarioId, franjaId) => {
  const banda = await obtenerBandaDelUsuario(usuarioId);
  const franja = await prisma.disponibilidadBanda.findUnique({ where: { id: Number(franjaId) } });
  if (!franja || franja.bandaId !== banda.id) {
    const error = new Error('Franja no encontrada o no pertenece a esta banda.');
    error.status = 404;
    throw error;
  }
  return { banda, franja };
};

// Compara "HH:mm" como string lexicográfico (funciona para formato 24h uniforme)
const minutosDesde = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const seSolapa = (inicioA, finA, inicioB, finB) => {
  const a1 = minutosDesde(inicioA), a2 = minutosDesde(finA);
  const b1 = minutosDesde(inicioB), b2 = minutosDesde(finB);
  return a1 < b2 && b1 < a2;
};

const obtenerDisponibilidad = async (bandaId) => {
  return prisma.disponibilidadBanda.findMany({
    where: { bandaId: Number(bandaId) },
    orderBy: [{ fecha: 'asc' }, { franjaInicio: 'asc' }],
  });
};

const crearFranjaEnDia = async (bandaId, fechaDate, franjaInicio, franjaFin, estado) => {
  const inicio = new Date(fechaDate); inicio.setUTCHours(0, 0, 0, 0);
  const fin = new Date(fechaDate); fin.setUTCHours(23, 59, 59, 999);

  const franjasDelDia = await prisma.disponibilidadBanda.findMany({
    where: { bandaId, fecha: { gte: inicio, lte: fin } },
  });

  const hayConflicto = franjasDelDia.some((f) => seSolapa(franjaInicio, franjaFin, f.franjaInicio, f.franjaFin));
  if (hayConflicto) return null;

  return prisma.disponibilidadBanda.create({
    data: { bandaId, fecha: fechaDate, franjaInicio, franjaFin, estado },
  });
};

const crearFranja = async (usuarioId, datos) => {
  const { fecha, fechaInicio, fechaFin, franjaInicio, franjaFin, estado = 'disponible' } = datos;

  if (minutosDesde(franjaInicio) >= minutosDesde(franjaFin)) {
    const error = new Error('La hora de inicio debe ser anterior a la hora de fin.');
    error.status = 400;
    throw error;
  }

  const banda = await obtenerBandaDelUsuario(usuarioId);

  // Modo simple: un solo campo "fecha"
  if (!fechaInicio && !fechaFin) {
    const fechaDate = new Date(fecha);
    const resultado = await crearFranjaEnDia(banda.id, fechaDate, franjaInicio, franjaFin, estado);
    if (!resultado) {
      const error = new Error('La franja horaria se solapa con una existente en ese día.');
      error.status = 409;
      throw error;
    }
    return { creadas: [resultado], omitidas: [] };
  }

  // Modo rango
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diffMs = fin - inicio;
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    const error = new Error('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
    error.status = 400;
    throw error;
  }
  if (diffDias > 90) {
    const error = new Error('El rango no puede superar 90 días.');
    error.status = 400;
    throw error;
  }

  const creadas = [];
  const omitidas = [];

  for (let i = 0; i <= diffDias; i++) {
    const dia = new Date(inicio);
    dia.setUTCDate(inicio.getUTCDate() + i);
    const resultado = await crearFranjaEnDia(banda.id, dia, franjaInicio, franjaFin, estado);
    const fechaStr = dia.toISOString().split('T')[0];
    if (resultado) {
      creadas.push(resultado);
    } else {
      omitidas.push(fechaStr);
    }
  }

  return { creadas, omitidas };
};

const actualizarFranja = async (usuarioId, franjaId, datos) => {
  const { franja } = await verificarPropiedad(usuarioId, franjaId);
  const { franjaInicio, franjaFin, estado } = datos;

  const nuevoInicio = franjaInicio ?? franja.franjaInicio;
  const nuevoFin = franjaFin ?? franja.franjaFin;

  if (minutosDesde(nuevoInicio) >= minutosDesde(nuevoFin)) {
    const error = new Error('La hora de inicio debe ser anterior a la hora de fin.');
    error.status = 400;
    throw error;
  }

  return prisma.disponibilidadBanda.update({
    where: { id: franja.id },
    data: {
      ...(franjaInicio !== undefined && { franjaInicio }),
      ...(franjaFin !== undefined && { franjaFin }),
      ...(estado !== undefined && { estado }),
    },
  });
};

const eliminarFranja = async (usuarioId, franjaId) => {
  const { franja } = await verificarPropiedad(usuarioId, franjaId);
  await prisma.disponibilidadBanda.delete({ where: { id: franja.id } });
};

module.exports = { obtenerDisponibilidad, crearFranja, actualizarFranja, eliminarFranja };
