const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/resenaController');

router.get('/banda/:bandaId', ctrl.porBanda);
router.post('/:solicitudId', auth, ctrl.crear);
router.put('/:resenaId/respuesta', auth, ctrl.responder);

module.exports = router;
