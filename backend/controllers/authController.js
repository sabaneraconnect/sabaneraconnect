const authService = require('../services/authService');

const registroBanda = async (req, res, next) => {
  try {
    const usuario = await authService.registrarBanda(req.body);

    res.status(201).json({
      mensaje: 'Banda registrada correctamente.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registroBanda,
};