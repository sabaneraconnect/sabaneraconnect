const prisma = require('../db');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MB = 1024 * 1024;
const LIMITE_FOTO = 50 * MB;
const LIMITE_VIDEO = 500 * MB;

const obtenerPerfil = async (bandaId) => {
  const banda = await prisma.banda.findUnique({
    where: { id: Number(bandaId) },
    include: {
      usuario: { select: { nombre: true, correo: true, telefono: true } },
      multimedia: { orderBy: { fechaCarga: 'desc' } },
    },
  });

  if (!banda) {
    const error = new Error('Banda no encontrada.');
    error.status = 404;
    throw error;
  }

  return banda;
};

const actualizarPerfil = async (usuarioId, datos) => {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario || usuario.rol !== 'banda') {
    const error = new Error('Acceso denegado.');
    error.status = 403;
    throw error;
  }

  const { integrantes, generos, municipiosCobertura, aniosExperiencia, municipio, departamento, nit } = datos;

  return prisma.banda.update({
    where: { usuarioId },
    data: {
      ...(integrantes !== undefined && { integrantes }),
      ...(generos !== undefined && { generos }),
      ...(municipiosCobertura !== undefined && { municipiosCobertura }),
      ...(aniosExperiencia !== undefined && { aniosExperiencia: Number(aniosExperiencia) }),
      ...(municipio !== undefined && { municipio }),
      ...(departamento !== undefined && { departamento }),
      ...(nit !== undefined && { nit }),
    },
  });
};

const subirMultimedia = async (usuarioId, archivo, tipo) => {
  const limite = tipo === 'video' ? LIMITE_VIDEO : LIMITE_FOTO;
  if (archivo.size > limite) {
    const limiteMB = tipo === 'video' ? 500 : 50;
    const error = new Error(`El archivo supera el límite de ${limiteMB} MB para ${tipo}s.`);
    error.status = 400;
    throw error;
  }

  const banda = await prisma.banda.findUnique({ where: { usuarioId } });
  if (!banda) {
    const error = new Error('Banda no encontrada.');
    error.status = 404;
    throw error;
  }

  const resourceType = tipo === 'video' ? 'video' : 'image';

  const resultado = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'sabaneraconnect/bandas', resource_type: resourceType },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(archivo.buffer);
  });

  return prisma.multimediaBanda.create({
    data: { bandaId: banda.id, url: resultado.secure_url, tipo },
  });
};

const eliminarMultimedia = async (usuarioId, archivoId) => {
  const banda = await prisma.banda.findUnique({ where: { usuarioId } });
  if (!banda) {
    const error = new Error('Banda no encontrada.');
    error.status = 404;
    throw error;
  }

  const archivo = await prisma.multimediaBanda.findUnique({ where: { id: Number(archivoId) } });
  if (!archivo || archivo.bandaId !== banda.id) {
    const error = new Error('Archivo no encontrado o no pertenece a esta banda.');
    error.status = 404;
    throw error;
  }

  // Extraer public_id de la URL de Cloudinary
  const partes = archivo.url.split('/');
  const publicId = partes.slice(partes.indexOf('sabaneraconnect')).join('/').replace(/\.[^/.]+$/, '');
  const resourceType = archivo.tipo === 'video' ? 'video' : 'image';

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  await prisma.multimediaBanda.delete({ where: { id: archivo.id } });
};

const publicarPerfil = async (usuarioId) => {
  const banda = await prisma.banda.findUnique({ where: { usuarioId } });
  if (!banda) {
    const error = new Error('Banda no encontrada.');
    error.status = 404;
    throw error;
  }

  const faltantes = [];
  if (!banda.integrantes) faltantes.push('integrantes');
  if (!banda.generos) faltantes.push('géneros musicales');
  if (!banda.municipio) faltantes.push('municipio');

  if (faltantes.length > 0) {
    const error = new Error(`Para publicar el perfil debes completar: ${faltantes.join(', ')}.`);
    error.status = 400;
    throw error;
  }

  return prisma.banda.update({
    where: { usuarioId },
    data: { estadoPerfil: 'publicado' },
  });
};

module.exports = { obtenerPerfil, actualizarPerfil, subirMultimedia, eliminarMultimedia, publicarPerfil };
