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

const registroOrganizador = async (req, res, next) => {
  try {
    const usuario = await authService.registrarOrganizador(req.body);

    res.status(201).json({
      mensaje: 'Organizador registrado correctamente.',
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

const login = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await authService.login(correo, contrasena);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const recuperarContrasena = async (req, res, next) => {
  try {
    const { correo } = req.body;
    const mensaje = await authService.recuperarContrasena(correo);
    res.status(200).json({ mensaje });
  } catch (error) {
    next(error);
  }
};

const nuevaContrasena = async (req, res, next) => {
  try {
    const { token, nuevaContrasena } = req.body;
    await authService.nuevaContrasena(token, nuevaContrasena);
    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registroBanda,
  registroOrganizador,
  login,
  recuperarContrasena,
  nuevaContrasena,
};