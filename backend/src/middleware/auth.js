const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de autenticação
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_jwt');
    req.usuario = decoded;
    next();
  } catch (erro) {
    res.status(401).json({ erro: 'Token inválido' });
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
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

module.exports = {
  auth,
  verificarPermissao,
  apenasAdmin
}; 