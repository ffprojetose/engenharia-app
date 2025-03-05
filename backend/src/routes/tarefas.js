const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const { auth, verificarPermissao } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(auth);

// Todas as rotas precisam de permissão para tarefas
router.use(verificarPermissao('tarefas'));

// Rotas principais
router.post('/', tarefaController.criar);
router.get('/', tarefaController.listar);
router.get('/:id', tarefaController.buscarPorId);
router.put('/:id', tarefaController.atualizar);

// Rotas para comentários
router.post('/:id/comentarios', tarefaController.adicionarComentario);

// Rota para registro de horas
router.post('/:id/horas', tarefaController.registrarHoras);

module.exports = router; 