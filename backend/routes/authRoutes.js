const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro-banda', authController.registroBanda);

module.exports = router;