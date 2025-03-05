const express = require('express');
const router = express.Router();
const reuniaoController = require('../controllers/reuniaoController');
const { auth, verificarPermissao } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(auth);

// Todas as rotas precisam de permissão para reuniões
router.use(verificarPermissao('reunioes'));

// Rotas principais
router.post('/', reuniaoController.criar);
router.get('/', reuniaoController.listar);
router.get('/:id', reuniaoController.buscarPorId);
router.put('/:id', reuniaoController.atualizar);

// Rotas para presença
router.post('/:id/confirmar-presenca', reuniaoController.confirmarPresenca);
router.post('/:id/participantes/:participanteId/presenca', reuniaoController.registrarPresenca);

// Rotas para pauta e decisões
router.post('/:id/pauta', reuniaoController.adicionarPauta);
router.post('/:id/decisoes', reuniaoController.adicionarDecisao);

// Rotas para ata
router.post('/:id/ata', reuniaoController.registrarAta);
router.post('/:id/ata/aprovar', reuniaoController.aprovarAta);

module.exports = router; 