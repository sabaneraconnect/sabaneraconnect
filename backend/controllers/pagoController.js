const svc = require('../services/pagoService');

const iniciar = async (req, res, next) => {
  try {
    const { tipo, porcentajeAnticipo } = req.body;
    const result = await svc.iniciarPago(req.usuario.id, req.params.solicitudId, tipo, porcentajeAnticipo);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const confirmarUno = async (req, res, next) => {
  try {
    const pago = await svc.confirmarPagoUno(req.usuario.id, req.params.solicitudId);
    res.json(pago);
  } catch (err) { next(err); }
};

const iniciarDos = async (req, res, next) => {
  try {
    const result = await svc.iniciarPagoDos(req.usuario.id, req.params.solicitudId);
    res.json(result);
  } catch (err) { next(err); }
};

const confirmarDos = async (req, res, next) => {
  try {
    const pago = await svc.confirmarPagoDos(req.usuario.id, req.params.solicitudId);
    res.json(pago);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const pago = await svc.obtenerPago(req.usuario.id, req.params.solicitudId);
    res.json(pago);
  } catch (err) { next(err); }
};

module.exports = { iniciar, confirmarUno, iniciarDos, confirmarDos, obtener };
