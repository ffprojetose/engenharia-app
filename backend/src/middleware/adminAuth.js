module.exports = (req, res, next) => {
  try {
    // Verificar se o usuário existe no request (middleware auth deve ser executado antes)
    if (!req.usuario) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Verificar se o usuário é admin
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro na verificação de permissões', error: error.message });
  }
}; 