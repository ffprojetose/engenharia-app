const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');
const { auth } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(auth);

// Rotas principais
router.post('/', projetoController.criar);
router.get('/', projetoController.listar);
router.get('/:id', projetoController.buscarPorId);
router.put('/:id', projetoController.atualizar);
router.delete('/:id', projetoController.excluir);

// Rotas para etapas
router.post('/:id/etapas', projetoController.adicionarEtapa);
router.put('/:id/etapas/:etapaId', projetoController.atualizarEtapa);

// Rotas para equipe
router.post('/:id/equipe', projetoController.adicionarMembroEquipe);
router.delete('/:id/equipe/:membroId', projetoController.removerMembroEquipe);

module.exports = router; 