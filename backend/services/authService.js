const prisma = require('../db');
const bcrypt = require('bcrypt');
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

module.exports = {
  registrarBanda,
};