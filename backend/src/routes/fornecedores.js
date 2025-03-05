const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const { auth, verificarPermissao } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(auth);

// Todas as rotas precisam de permissão para fornecedores
router.use(verificarPermissao('parceiros'));

// Rotas principais
router.post('/', fornecedorController.criar);
router.get('/', fornecedorController.listar);
router.get('/:id', fornecedorController.buscarPorId);
router.put('/:id', fornecedorController.atualizar);

// Rotas para avaliações
router.post('/:id/avaliacoes', fornecedorController.adicionarAvaliacao);

// Rotas para produtos
router.post('/:id/produtos', fornecedorController.adicionarProduto);

// Rotas para status
router.patch('/:id/status', fornecedorController.atualizarStatus);

// Rotas para documentos
router.post('/:id/documentos', fornecedorController.adicionarDocumento);

module.exports = router; 