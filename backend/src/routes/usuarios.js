const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, apenasAdmin } = require('../middleware/auth');
const usuarioController = require('../controllers/usuarioController');

// Rotas públicas
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET || 'seu_segredo_jwt',
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// Rotas protegidas
router.use(auth);

// Rotas apenas para admin
router.post('/registrar', apenasAdmin, usuarioController.registrar);
router.get('/', apenasAdmin, usuarioController.listarUsuarios);
router.put('/:id', apenasAdmin, usuarioController.atualizar);
router.delete('/:id', apenasAdmin, usuarioController.desativar);

// Rota para criar usuário (apenas admin)
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const usuario = await Usuario.create({ nome, email, senha, tipo });
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

// Rota para listar usuários (apenas admin)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'tipo', 'ativo']
    });
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
});

module.exports = router; 