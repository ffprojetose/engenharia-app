const Tarefa = require('../models/Tarefa');
const Projeto = require('../models/Projeto');

// Criar nova tarefa
exports.criar = async (req, res) => {
  try {
    const tarefa = new Tarefa({
      ...req.body,
      criadoPor: req.usuario._id
    });

    await tarefa.save();

    // Se a tarefa estiver associada a uma etapa, adicionar à etapa
    if (tarefa.etapa) {
      await Projeto.findOneAndUpdate(
        { 'etapas._id': tarefa.etapa },
        { $push: { 'etapas.$.tarefas': tarefa._id } }
      );
    }

    await tarefa.populate([
      { path: 'responsavel', select: 'nome email' },
      { path: 'projeto', select: 'nome' },
      { path: 'dependencias', select: 'titulo status' }
    ]);

    res.status(201).json({
      message: 'Tarefa criada com sucesso',
      tarefa
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
  }
};

// Listar todas as tarefas
exports.listar = async (req, res) => {
  try {
    const { 
      projeto, 
      responsavel, 
      status, 
      prioridade, 
      busca,
      atrasadas 
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (projeto) query.projeto = projeto;
    if (responsavel) query.responsavel = responsavel;
    if (status) query.status = status;
    if (prioridade) query.prioridade = prioridade;
    if (busca) {
      query.$or = [
        { titulo: new RegExp(busca, 'i') },
        { descricao: new RegExp(busca, 'i') }
      ];
    }

    const tarefas = await Tarefa.find(query)
      .populate('responsavel', 'nome email')
      .populate('projeto', 'nome')
      .populate('etapa', 'nome')
      .populate('dependencias', 'titulo status')
      .sort({ dataCriacao: -1 });

    // Adicionar informações calculadas
    const tarefasComInfo = tarefas.map(tarefa => {
      const doc = tarefa.toObject();
      doc.atrasada = tarefa.verificarAtraso();
      doc.tempoRestante = tarefa.calcularTempoRestante();
      return doc;
    });

    // Filtrar tarefas atrasadas se solicitado
    const tarefasFiltradas = atrasadas === 'true' 
      ? tarefasComInfo.filter(t => t.atrasada)
      : tarefasComInfo;

    res.json(tarefasFiltradas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar tarefas', error: error.message });
  }
};

// Buscar tarefa por ID
exports.buscarPorId = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id)
      .populate('responsavel', 'nome email')
      .populate('projeto', 'nome')
      .populate('etapa', 'nome')
      .populate('dependencias', 'titulo status')
      .populate('comentarios.autor', 'nome email');

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const tarefaInfo = tarefa.toObject();
    tarefaInfo.atrasada = tarefa.verificarAtraso();
    tarefaInfo.tempoRestante = tarefa.calcularTempoRestante();

    res.json(tarefaInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefa', error: error.message });
  }
};

// Atualizar tarefa
exports.atualizar = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    // Se estiver alterando o status para concluído, registrar a data de conclusão
    if (req.body.status === 'concluida' && tarefa.status !== 'concluida') {
      req.body.dataFimReal = new Date();
    }

    // Atualizar campos
    Object.keys(req.body).forEach(key => {
      tarefa[key] = req.body[key];
    });

    await tarefa.save();

    await tarefa.populate([
      { path: 'responsavel', select: 'nome email' },
      { path: 'projeto', select: 'nome' },
      { path: 'etapa', select: 'nome' },
      { path: 'dependencias', select: 'titulo status' }
    ]);

    res.json({
      message: 'Tarefa atualizada com sucesso',
      tarefa
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

// Adicionar comentário
exports.adicionarComentario = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    tarefa.comentarios.push({
      autor: req.usuario._id,
      conteudo: req.body.conteudo
    });

    await tarefa.save();

    await tarefa.populate('comentarios.autor', 'nome email');

    res.json({
      message: 'Comentário adicionado com sucesso',
      tarefa
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar comentário', error: error.message });
  }
};

// Registrar horas trabalhadas
exports.registrarHoras = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const horasAdicionais = Number(req.body.horas);
    tarefa.horasGastas += horasAdicionais;

    await tarefa.save();

    res.json({
      message: 'Horas registradas com sucesso',
      tarefa
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar horas', error: error.message });
  }
}; 