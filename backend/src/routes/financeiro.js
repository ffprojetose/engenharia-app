const express = require('express');
const router = express.Router();
const financeiroController = require('../controllers/financeiroController');
const { auth, verificarPermissao } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(auth);

// Todas as rotas precisam de permissão para financeiro
router.use(verificarPermissao('financeiro'));

// Rotas para transações
router.post('/transacoes', financeiroController.criarTransacao);
router.get('/transacoes', financeiroController.listarTransacoes);
router.patch('/transacoes/:transacaoId/status', financeiroController.atualizarStatusTransacao);

// Rotas para orçamentos
router.post('/orcamentos', financeiroController.criarOrcamento);
router.post('/orcamentos/:orcamentoId/aprovar', financeiroController.aprovarOrcamento);

// Rota para relatórios
router.get('/relatorio', financeiroController.obterRelatorio);

module.exports = router; 