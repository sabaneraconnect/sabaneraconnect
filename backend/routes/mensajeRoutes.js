const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/mensajeController');

router.get('/:solicitudId', auth, ctrl.listar);
router.post('/:solicitudId', auth, ctrl.enviar);

module.exports = router;
