const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const registrarBanda = async (datos) => {
  const { nombre, correo, contrasena, telefono, municipio, nit } = datos;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (usuarioExistente) {
    const error = new Error('Ya existe una cuenta registrada con este correo.');
    error.status = 409;
    throw error;
  }

  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      telefono,
      rol: 'banda',
      banda: {
        create: {
          municipio,
          nit: nit || null,
        },
      },
    },
    include: {
      banda: true,
    },
  });

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: nuevoUsuario.correo,
      subject: 'Bienvenido a SabaneraConnect',
      html: `
        <h2>¡Bienvenido a SabaneraConnect, ${nuevoUsuario.nombre}!</h2>
        <p>Tu registro fue completado exitosamente. Ya puedes iniciar sesión y comenzar a usar la plataforma.</p>
        <p>Gracias por unirte a SabaneraConnect.</p>
      `,
    });
  } catch (emailError) {
    console.error('Error al enviar correo de bienvenida:', emailError.message);
  }

  return nuevoUsuario;
};

const registrarOrganizador = async (datos) => {
  const { nombre, correo, contrasena, telefono } = datos;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (usuarioExistente) {
    const error = new Error('Ya existe una cuenta registrada con este correo.');
    error.status = 409;
    throw error;
  }

  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      telefono,
      rol: 'organizador',
      organizador: {
        create: {},
      },
    },
    include: {
      organizador: true,
    },
  });

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: nuevoUsuario.correo,
      subject: 'Bienvenido a SabaneraConnect',
      html: `
        <h2>¡Bienvenido a SabaneraConnect, ${nuevoUsuario.nombre}!</h2>
        <p>Tu registro como organizador fue completado exitosamente. Ya puedes iniciar sesión y comenzar a contratar bandas.</p>
        <p>Gracias por unirte a SabaneraConnect.</p>
      `,
    });
  } catch (emailError) {
    console.error('Error al enviar correo de bienvenida:', emailError.message);
  }

  return nuevoUsuario;
};

const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

const login = async (correo, contrasena) => {
  const errorGenerico = new Error('Correo o contraseña incorrectos.');
  errorGenerico.status = 401;

  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  if (!usuario) throw errorGenerico;

  if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
    const error = new Error('Cuenta bloqueada temporalmente. Intenta de nuevo en unos minutos.');
    error.status = 401;
    throw error;
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    const nuevosIntentos = usuario.intentosFallidos + 1;
    const bloqueadoHasta = nuevosIntentos >= MAX_INTENTOS
      ? new Date(Date.now() + MINUTOS_BLOQUEO * 60 * 1000)
      : null;

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        intentosFallidos: nuevosIntentos,
        ...(bloqueadoHasta && { bloqueadoHasta }),
      },
    });

    if (nuevosIntentos >= MAX_INTENTOS) {
      const error = new Error('Cuenta bloqueada temporalmente. Intenta de nuevo en unos minutos.');
      error.status = 401;
      throw error;
    }

    throw errorGenerico;
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { intentosFallidos: 0, bloqueadoHasta: null },
  });

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } };
};

const recuperarContrasena = async (correo) => {
  const mensajeGenerico = 'Si ese correo está registrado, recibirás un enlace de recuperación.';

  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  if (!usuario) return mensajeGenerico;

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const enlace = `${frontendUrl}/nueva-contrasena?token=${token}`;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: correo,
      subject: 'Recuperación de contraseña - SabaneraConnect',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hola ${usuario.nombre}, recibimos una solicitud para restablecer tu contraseña.</p>
        <p><a href="${enlace}">Haz clic aquí para crear una nueva contraseña</a></p>
        <p>Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      `,
    });
  } catch (emailError) {
    console.error('Error al enviar correo de recuperación:', emailError.message);
  }

  return mensajeGenerico;
};

const nuevaContrasena = async (token, nuevaContrasena) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const error = new Error('El enlace de recuperación es inválido o ha expirado.');
    error.status = 400;
    throw error;
  }

  const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, 10);

  await prisma.usuario.update({
    where: { id: payload.id },
    data: { contrasena: contrasenaEncriptada, intentosFallidos: 0, bloqueadoHasta: null },
  });
};

module.exports = {
  registrarBanda,
  registrarOrganizador,
  login,
  recuperarContrasena,
  nuevaContrasena,
};