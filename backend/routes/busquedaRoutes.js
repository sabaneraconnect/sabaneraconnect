const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/busquedaController');

router.get('/bandas', ctrl.buscarBandas);

module.exports = router;
