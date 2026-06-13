const { obtenerMensajes, enviarMensaje } = require('../services/mensajeService');

const listar = async (req, res, next) => {
  try {
    const mensajes = await obtenerMensajes(req.usuario.id, req.params.solicitudId);
    res.json(mensajes);
  } catch (err) { next(err); }
};

const enviar = async (req, res, next) => {
  try {
    const { contenido } = req.body;
    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ error: 'El contenido no puede estar vacío.' });
    }
    const mensaje = await enviarMensaje(req.usuario.id, req.params.solicitudId, contenido.trim());
    res.status(201).json(mensaje);
  } catch (err) { next(err); }
};

module.exports = { listar, enviar };
