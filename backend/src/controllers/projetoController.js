const Projeto = require('../models/Projeto');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Tarefa = require('../models/Tarefa');
const Reuniao = require('../models/Reuniao');
const { Op } = require('sequelize');

// Criar novo projeto
exports.criar = async (req, res) => {
  try {
    // Verificar se o cliente existe
    const cliente = await Cliente.findByPk(req.body.cliente_id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Verificar se o responsável existe
    const responsavel = await Usuario.findByPk(req.body.responsavel_id);
    if (!responsavel) {
      return res.status(404).json({ message: 'Responsável não encontrado' });
    }

    const projeto = await Projeto.create(req.body);

    // Buscar o projeto com as associações
    const projetoCompleto = await Projeto.findByPk(projeto.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      projeto: projetoCompleto
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ message: 'Erro ao criar projeto', error: error.message });
  }
};

// Listar todos os projetos
exports.listar = async (req, res) => {
  try {
    const { status, cliente_id, responsavel_id, busca } = req.query;
    
    let where = {};
    
    // Filtros
    if (status) where.status = status;
    if (cliente_id) where.cliente_id = cliente_id;
    if (responsavel_id) where.responsavel_id = responsavel_id;
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { descricao: { [Op.like]: `%${busca}%` } }
      ];
    }

    const projetos = await Projeto.findAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(projetos);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({ message: 'Erro ao listar projetos', error: error.message });
  }
};

// Buscar projeto por ID
exports.buscarPorId = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Tarefa,
          as: 'tarefas'
        },
        {
          model: Reuniao,
          as: 'reunioes'
        }
      ]
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    res.json(projeto);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ message: 'Erro ao buscar projeto', error: error.message });
  }
};

// Atualizar projeto
exports.atualizar = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Verificar se o cliente existe
    if (req.body.cliente_id) {
      const cliente = await Cliente.findByPk(req.body.cliente_id);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
    }

    // Verificar se o responsável existe
    if (req.body.responsavel_id) {
      const responsavel = await Usuario.findByPk(req.body.responsavel_id);
      if (!responsavel) {
        return res.status(404).json({ message: 'Responsável não encontrado' });
      }
    }

    await projeto.update(req.body);

    // Buscar o projeto atualizado com as associações
    const projetoAtualizado = await Projeto.findByPk(projeto.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    res.json({
      message: 'Projeto atualizado com sucesso',
      projeto: projetoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ message: 'Erro ao atualizar projeto', error: error.message });
  }
};

// Adicionar etapa ao projeto
exports.adicionarEtapa = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    projeto.etapas.push(req.body);
    await projeto.save();

    await projeto.populate('etapas.responsavel', 'nome email');

    res.json({
      message: 'Etapa adicionada com sucesso',
      projeto
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar etapa', error: error.message });
  }
};

// Atualizar etapa do projeto
exports.atualizarEtapa = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const etapa = projeto.etapas.id(req.params.etapaId);
    if (!etapa) {
      return res.status(404).json({ message: 'Etapa não encontrada' });
    }

    Object.keys(req.body).forEach(key => {
      etapa[key] = req.body[key];
    });

    await projeto.save();

    await projeto.populate('etapas.responsavel', 'nome email');

    res.json({
      message: 'Etapa atualizada com sucesso',
      projeto
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar etapa', error: error.message });
  }
};

// Adicionar membro à equipe
exports.adicionarMembroEquipe = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    projeto.equipe.push(req.body);
    await projeto.save();

    await projeto.populate('equipe.membro', 'nome email');

    res.json({
      message: 'Membro adicionado à equipe com sucesso',
      projeto
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar membro à equipe', error: error.message });
  }
};

// Remover membro da equipe
exports.removerMembroEquipe = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    projeto.equipe = projeto.equipe.filter(
      membro => membro._id.toString() !== req.params.membroId
    );

    await projeto.save();

    res.json({
      message: 'Membro removido da equipe com sucesso',
      projeto
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover membro da equipe', error: error.message });
  }
};

// Excluir projeto
exports.excluir = async (req, res) => {
  try {
    const projeto = await Projeto.findByPk(req.params.id);

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    await projeto.destroy();

    res.json({
      message: 'Projeto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
    res.status(500).json({ message: 'Erro ao excluir projeto', error: error.message });
  }
}; 