const prisma = require('../db');

const minutosDesde = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const buscarBandas = async (filtros = {}, pagina = 1, limite = 5) => {
  const { genero, departamento, fecha, franjaInicio, franjaFin } = filtros;
  limite = Math.max(5, Number(limite));
  pagina = Math.max(1, Number(pagina));

  const where = { estadoPerfil: 'publicado' };

  if (genero) {
    where.generos = { contains: genero, mode: 'insensitive' };
  }

  if (departamento) {
    where.OR = [
      { departamento: { equals: departamento, mode: 'insensitive' } },
      { municipiosCobertura: { contains: departamento, mode: 'insensitive' } },
    ];
  }

  // Obtener IDs de bandas que cumplen filtros de texto primero
  let bandasIds = null;

  if (fecha && franjaInicio && franjaFin) {
    const fechaInicio = new Date(fecha);
    fechaInicio.setUTCHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setUTCHours(23, 59, 59, 999);

    const minSolicitadoInicio = minutosDesde(franjaInicio);
    const minSolicitadoFin = minutosDesde(franjaFin);

    const franjas = await prisma.disponibilidadBanda.findMany({
      where: {
        estado: 'disponible',
        fecha: { gte: fechaInicio, lte: fechaFin },
      },
    });

    const idsBandaConDisponibilidad = franjas
      .filter((f) => minutosDesde(f.franjaInicio) <= minSolicitadoInicio && minutosDesde(f.franjaFin) >= minSolicitadoFin)
      .map((f) => f.bandaId);

    bandasIds = [...new Set(idsBandaConDisponibilidad)];
    if (bandasIds.length === 0) {
      return { resultados: [], total: 0, pagina, totalPaginas: 0 };
    }
    where.id = { in: bandasIds };
  }

  const [total, bandas] = await Promise.all([
    prisma.banda.count({ where }),
    prisma.banda.findMany({
      where,
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        usuario: { select: { nombre: true } },
        multimedia: { where: { tipo: 'foto' }, orderBy: { fechaCarga: 'desc' }, take: 1 },
      },
      orderBy: { id: 'asc' },
    }),
  ]);

  const resultados = bandas.map((b) => ({
    id: b.id,
    nombre: b.usuario.nombre,
    generos: b.generos,
    departamento: b.departamento,
    municipio: b.municipio,
    rangoPrecio: b.rangoPrecio,
    foto: b.multimedia[0]?.url ?? null,
    promedioEstrellas: null,
  }));

  return { resultados, total, pagina, totalPaginas: Math.ceil(total / limite) };
};

module.exports = { buscarBandas };
