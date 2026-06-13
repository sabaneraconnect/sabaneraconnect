const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/solicitudController');

router.post('/', auth, ctrl.crearSolicitud);
router.get('/organizador/mias', auth, ctrl.listarPorOrganizador);
router.get('/banda/recibidas', auth, ctrl.listarPorBanda);
router.get('/:id', auth, ctrl.obtenerSolicitud);
router.put('/:id/respuesta', auth, ctrl.responderSolicitud);

module.exports = router;
