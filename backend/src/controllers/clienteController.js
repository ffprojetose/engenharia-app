const Cliente = require('../models/Cliente');
const { Op } = require('sequelize');

// Criar novo cliente
exports.criar = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
};

// Listar todos os clientes
exports.listar = async (req, res) => {
  try {
    const { busca, tipo, ativo } = req.query;
    
    let where = {};
    
    // Filtro de busca
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { email: { [Op.like]: `%${busca}%` } },
        { documento: { [Op.like]: `%${busca}%` } }
      ];
    }

    // Filtro por tipo
    if (tipo) {
      where.tipo = tipo;
    }

    // Filtro por status
    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    const clientes = await Cliente.findAll({
      where,
      order: [['nome', 'ASC']]
    });

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
};

// Buscar cliente por ID
exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: ['projetos']
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
};

// Atualizar cliente
exports.atualizar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await cliente.update(req.body);

    res.json({
      message: 'Cliente atualizado com sucesso',
      cliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
};

// Desativar cliente
exports.desativar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await cliente.update({ ativo: false });

    res.json({
      message: 'Cliente desativado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desativar cliente', error: error.message });
  }
};

// Adicionar contato ao cliente
exports.adicionarContato = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const contatos = cliente.contatos || [];
    contatos.push(req.body);
    
    await cliente.update({ contatos });

    res.json({
      message: 'Contato adicionado com sucesso',
      cliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar contato', error: error.message });
  }
};

// Remover contato do cliente
exports.removerContato = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const contatos = (cliente.contatos || []).filter(
      contato => contato.id !== req.params.contatoId
    );
    
    await cliente.update({ contatos });

    res.json({
      message: 'Contato removido com sucesso',
      cliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover contato', error: error.message });
  }
}; 