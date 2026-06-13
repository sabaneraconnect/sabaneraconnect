const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/pagoController');

router.post('/:solicitudId/iniciar', auth, ctrl.iniciar);
router.post('/:solicitudId/confirmar-uno', auth, ctrl.confirmarUno);
router.post('/:solicitudId/iniciar-dos', auth, ctrl.iniciarDos);
router.post('/:solicitudId/confirmar-dos', auth, ctrl.confirmarDos);
router.get('/:solicitudId', auth, ctrl.obtener);

module.exports = router;
