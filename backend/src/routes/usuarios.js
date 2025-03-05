const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { auth, apenasAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/login', usuarioController.login);

// Rotas protegidas
router.use(auth);

// Rotas apenas para admin
router.post('/registrar', apenasAdmin, usuarioController.registrar);
router.get('/', apenasAdmin, usuarioController.listarUsuarios);
router.put('/:id', apenasAdmin, usuarioController.atualizar);
router.delete('/:id', apenasAdmin, usuarioController.desativar);

module.exports = router; 