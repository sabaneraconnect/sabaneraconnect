const svc = require('../services/solicitudService');

const crearSolicitud = async (req, res, next) => {
  try {
    const solicitud = await svc.crearSolicitud(req.usuario.id, req.body);
    res.status(201).json({ mensaje: 'Solicitud enviada correctamente.', solicitud });
  } catch (e) { next(e); }
};

const obtenerSolicitud = async (req, res, next) => {
  try {
    const solicitud = await svc.obtenerSolicitud(req.usuario.id, req.params.id);
    res.json(solicitud);
  } catch (e) { next(e); }
};

const listarPorOrganizador = async (req, res, next) => {
  try {
    res.json(await svc.listarPorOrganizador(req.usuario.id));
  } catch (e) { next(e); }
};

const listarPorBanda = async (req, res, next) => {
  try {
    res.json(await svc.listarPorBanda(req.usuario.id));
  } catch (e) { next(e); }
};

const responderSolicitud = async (req, res, next) => {
  try {
    const { accion, contraOferta } = req.body;
    const actualizada = await svc.responderSolicitud(req.usuario.id, req.params.id, accion, { contraOferta });
    res.json({ mensaje: 'Respuesta registrada.', solicitud: actualizada });
  } catch (e) { next(e); }
};

module.exports = { crearSolicitud, obtenerSolicitud, listarPorOrganizador, listarPorBanda, responderSolicitud };
