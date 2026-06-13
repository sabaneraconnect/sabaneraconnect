const { crearResena, responderResena, obtenerResenasPorBanda } = require('../services/resenaService');

const crear = async (req, res, next) => {
  try {
    const { calificacion, comentario } = req.body;
    const resena = await crearResena(req.usuario.id, req.params.solicitudId, calificacion, comentario);
    res.status(201).json(resena);
  } catch (err) { next(err); }
};

const responder = async (req, res, next) => {
  try {
    const { respuesta } = req.body;
    if (!respuesta || !respuesta.trim()) {
      return res.status(400).json({ error: 'La respuesta no puede estar vacía.' });
    }
    const resena = await responderResena(req.usuario.id, req.params.resenaId, respuesta.trim());
    res.json(resena);
  } catch (err) { next(err); }
};

const porBanda = async (req, res, next) => {
  try {
    const data = await obtenerResenasPorBanda(req.params.bandaId);
    res.json(data);
  } catch (err) { next(err); }
};

module.exports = { crear, responder, porBanda };
