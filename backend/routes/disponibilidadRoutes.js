const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/disponibilidadController');
const prisma = require('../db');

const verificarPropietario = async (req, res, next) => {
  try {
    const banda = await prisma.banda.findUnique({ where: { id: Number(req.params.bandaId) } });
    if (!banda || banda.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este calendario.' });
    }
    next();
  } catch {
    next();
  }
};

router.get('/:bandaId', ctrl.obtenerDisponibilidad);
router.post('/:bandaId', auth, verificarPropietario, ctrl.crearFranja);
router.put('/:bandaId/:franjaId', auth, verificarPropietario, ctrl.actualizarFranja);
router.delete('/:bandaId/:franjaId', auth, verificarPropietario, ctrl.eliminarFranja);

module.exports = router;
