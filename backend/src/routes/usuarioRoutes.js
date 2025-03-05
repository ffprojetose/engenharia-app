const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Rotas públicas
router.post('/login', usuarioController.login);

// Rotas protegidas - requer autenticação
router.use(auth);

// Rotas que requerem privilégios de admin
router.post('/registrar', adminAuth, usuarioController.registrar);
router.get('/', adminAuth, usuarioController.listarUsuarios);
router.put('/:id', adminAuth, usuarioController.atualizar);
router.delete('/:id', adminAuth, usuarioController.desativar);

module.exports = router; 