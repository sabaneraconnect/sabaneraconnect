const disponibilidadService = require('../services/disponibilidadService');

const obtenerDisponibilidad = async (req, res, next) => {
  try {
    const franjas = await disponibilidadService.obtenerDisponibilidad(req.params.bandaId);
    res.json(franjas);
  } catch (error) {
    next(error);
  }
};

const crearFranja = async (req, res, next) => {
  try {
    const resultado = await disponibilidadService.crearFranja(req.usuario.id, req.body);
    const { creadas, omitidas } = resultado;
    if (creadas.length === 0) {
      return res.status(409).json({ error: 'Todas las franjas del rango se solapan con franjas existentes.', creadas, omitidas });
    }
    res.status(201).json({ mensaje: 'Franjas procesadas correctamente.', creadas, omitidas });
  } catch (error) {
    next(error);
  }
};

const actualizarFranja = async (req, res, next) => {
  try {
    const franja = await disponibilidadService.actualizarFranja(req.usuario.id, req.params.franjaId, req.body);
    res.json({ mensaje: 'Franja actualizada correctamente.', franja });
  } catch (error) {
    next(error);
  }
};

const eliminarFranja = async (req, res, next) => {
  try {
    await disponibilidadService.eliminarFranja(req.usuario.id, req.params.franjaId);
    res.json({ mensaje: 'Franja eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerDisponibilidad, crearFranja, actualizarFranja, eliminarFranja };
