const dotenv = require('dotenv');
dotenv.config();  // Carregar variáveis de ambiente

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função para gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Registrar novo usuário (apenas admin pode criar)
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo, cargo, telefone } = req.body;
    console.log('Tentativa de registro:', { nome, email, tipo, cargo }); // Log para debug

    // Verificar se o email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criar novo usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo,
      cargo,
      telefone
    });

    // Não retornar a senha
    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro no registro:', error); // Log para debug
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log('Dados recebidos:', { email, senha }); // Log dos dados recebidos

    // Buscar usuário
    const usuario = await Usuario.findOne({ where: { email } });
    console.log('Usuário encontrado:', usuario ? 'Sim' : 'Não'); // Log se encontrou usuário

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await usuario.checkPassword(senha);
    console.log('Senha correta:', senhaCorreta ? 'Sim' : 'Não'); // Log se a senha está correta

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se usuário está ativo
    console.log('Usuário ativo:', usuario.ativo ? 'Sim' : 'Não'); // Log se o usuário está ativo

    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Gerar token
    const token = gerarToken(usuario.id);
    console.log('Token gerado:', token); // Log do token gerado

    // Atualizar último acesso
    usuario.ultimo_acesso = new Date();
    await usuario.save();

    // Não retornar a senha
    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    console.log('Login bem-sucedido para:', email); // Log de sucesso

    res.json({
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    console.error('Erro detalhado no login:', error); // Log detalhado do erro
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

// Listar usuários (apenas admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error); // Log para debug
    res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, tipo, cargo, telefone } = req.body;
    console.log('Tentativa de atualização:', { id, nome, email, tipo, cargo }); // Log para debug

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const dadosAtualizacao = {
      nome,
      email,
      tipo,
      cargo,
      telefone
    };

    if (senha) {
      dadosAtualizacao.senha = senha;
    }

    await usuario.update(dadosAtualizacao);

    // Não retornar a senha
    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    res.json({
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error); // Log para debug
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};

// Desativar usuário (apenas admin)
exports.desativar = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await usuario.update({ ativo: false });

    res.json({
      message: 'Usuário desativado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desativar usuário', error: error.message });
  }
}; 