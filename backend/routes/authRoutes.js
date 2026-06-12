const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro-banda', authController.registroBanda);
router.post('/registro-organizador', authController.registroOrganizador);
router.post('/login', authController.login);
router.post('/recuperar-contrasena', authController.recuperarContrasena);
router.put('/nueva-contrasena', authController.nuevaContrasena);

module.exports = router;