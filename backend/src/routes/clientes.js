const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rotas públicas
router.get('/', clienteController.listar);

// Rotas que precisam de autenticação
router.post('/', clienteController.criar);
router.get('/:id', clienteController.buscarPorId);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.desativar);
router.post('/:id/contatos', clienteController.adicionarContato);
router.delete('/:id/contatos/:contatoId', clienteController.removerContato);

module.exports = router; 