const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middlewares/auth');
const bandaController = require('../controllers/bandaController');
const prisma = require('../db');

const upload = multer({ storage: multer.memoryStorage() });

// Middleware que verifica que el :id de la URL corresponde al usuario autenticado
const verificarPropietario = async (req, res, next) => {
  try {
    const banda = await prisma.banda.findUnique({ where: { id: Number(req.params.id) } });
    if (!banda || banda.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este perfil.' });
    }
    next();
  } catch {
    next();
  }
};

router.get('/:id', bandaController.obtenerPerfil);
router.put('/:id', auth, verificarPropietario, bandaController.actualizarPerfil);
router.post('/:id/multimedia', auth, verificarPropietario, upload.single('archivo'), bandaController.subirMultimedia);
router.delete('/:id/multimedia/:archivoId', auth, verificarPropietario, bandaController.eliminarMultimedia);
router.put('/:id/publicar', auth, verificarPropietario, bandaController.publicarPerfil);

module.exports = router;
