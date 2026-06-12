const busquedaService = require('../services/busquedaService');

const buscarBandas = async (req, res, next) => {
  try {
    const { genero, departamento, fecha, franjaInicio, franjaFin, pagina, limite } = req.query;
    const resultado = await busquedaService.buscarBandas(
      { genero, departamento, fecha, franjaInicio, franjaFin },
      pagina,
      limite,
    );
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = { buscarBandas };
