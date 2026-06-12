const bandaService = require('../services/bandaService');

const obtenerPerfil = async (req, res, next) => {
  try {
    const banda = await bandaService.obtenerPerfil(req.params.id);
    res.json(banda);
  } catch (error) {
    next(error);
  }
};

const actualizarPerfil = async (req, res, next) => {
  try {
    const banda = await bandaService.actualizarPerfil(req.usuario.id, req.body);
    res.json({ mensaje: 'Perfil actualizado correctamente.', banda });
  } catch (error) {
    next(error);
  }
};

const subirMultimedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    const { tipo } = req.body;
    if (!['foto', 'video'].includes(tipo)) {
      return res.status(400).json({ error: 'El tipo debe ser "foto" o "video".' });
    }
    const multimedia = await bandaService.subirMultimedia(req.usuario.id, req.file, tipo);
    res.status(201).json({ mensaje: 'Archivo subido correctamente.', multimedia });
  } catch (error) {
    next(error);
  }
};

const eliminarMultimedia = async (req, res, next) => {
  try {
    await bandaService.eliminarMultimedia(req.usuario.id, req.params.archivoId);
    res.json({ mensaje: 'Archivo eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};

const publicarPerfil = async (req, res, next) => {
  try {
    const banda = await bandaService.publicarPerfil(req.usuario.id);
    res.json({ mensaje: 'Perfil publicado correctamente.', banda });
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerPerfil, actualizarPerfil, subirMultimedia, eliminarMultimedia, publicarPerfil };
