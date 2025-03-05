const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de autenticação
const auth = async (req, res, next) => {
  try {
    // Verificar se o token existe no header
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token recebido:', token); // Log para debug
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Log para debug
    
    // Buscar usuário
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({ message: 'Usuário inativo' });
    }

    // Adicionar usuário ao request
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error); // Log para debug
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(500).json({ message: 'Erro na autenticação', error: error.message });
  }
};

// Middleware para verificar permissões
const verificarPermissao = (permissao) => {
  return (req, res, next) => {
    try {
      const usuario = req.usuario;
      
      // Permitir acesso para admin em qualquer rota
      if (usuario.tipo === 'admin') {
        return next();
      }

      // Verificar permissões específicas
      switch (permissao) {
        case 'financeiro':
          if (usuario.tipo === 'financeiro') return next();
          break;
        case 'projetos':
        case 'tarefas':
        case 'reunioes':
          if (usuario.tipo === 'membro') return next();
          break;
      }

      res.status(403).json({ message: 'Acesso negado' });
    } catch (error) {
      console.error('Erro ao verificar permissão:', error); // Log para debug
      res.status(500).json({ message: 'Erro ao verificar permissão', error: error.message });
    }
  };
};

// Middleware apenas para admin
const apenasAdmin = (req, res, next) => {
  try {
    const usuario = req.usuario;
    
    if (usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso restrito a administradores' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar admin:', error); // Log para debug
    res.status(500).json({ message: 'Erro ao verificar permissão de admin', error: error.message });
  }
};

module.exports = {
  auth,
  verificarPermissao,
  apenasAdmin
}; 