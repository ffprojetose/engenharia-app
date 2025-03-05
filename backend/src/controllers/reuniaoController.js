const Reuniao = require('../models/Reuniao');

// Criar nova reunião
exports.criar = async (req, res) => {
  try {
    const reuniao = new Reuniao({
      ...req.body,
      organizador: req.usuario._id,
      criadoPor: req.usuario._id
    });

    await reuniao.save();

    await reuniao.populate([
      { path: 'organizador', select: 'nome email' },
      { path: 'participantes.usuario', select: 'nome email' },
      { path: 'projeto', select: 'nome' }
    ]);

    res.status(201).json({
      message: 'Reunião criada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar reunião', error: error.message });
  }
};

// Listar todas as reuniões
exports.listar = async (req, res) => {
  try {
    const { 
      tipo, 
      projeto, 
      status, 
      dataInicio, 
      dataFim,
      participante 
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (tipo) query.tipo = tipo;
    if (projeto) query.projeto = projeto;
    if (status) query.status = status;
    if (participante) {
      query['participantes.usuario'] = participante;
    }
    
    // Filtro por período
    if (dataInicio || dataFim) {
      query.data = {};
      if (dataInicio) query.data.$gte = new Date(dataInicio);
      if (dataFim) query.data.$lte = new Date(dataFim);
    }

    const reunioes = await Reuniao.find(query)
      .populate('organizador', 'nome email')
      .populate('participantes.usuario', 'nome email')
      .populate('projeto', 'nome')
      .sort({ data: 1, horaInicio: 1 });

    // Adicionar informações calculadas
    const reunioesComInfo = reunioes.map(reuniao => {
      const doc = reuniao.toObject();
      doc.jaComecou = reuniao.verificarInicio();
      doc.jaTerminou = reuniao.verificarFim();
      return doc;
    });

    res.json(reunioesComInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar reuniões', error: error.message });
  }
};

// Buscar reunião por ID
exports.buscarPorId = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id)
      .populate('organizador', 'nome email')
      .populate('participantes.usuario', 'nome email')
      .populate('projeto', 'nome')
      .populate('pauta.responsavel', 'nome email')
      .populate('decisoes.responsavel', 'nome email')
      .populate('ata.aprovadoPor', 'nome email');

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    const reuniaoInfo = reuniao.toObject();
    reuniaoInfo.jaComecou = reuniao.verificarInicio();
    reuniaoInfo.jaTerminou = reuniao.verificarFim();

    res.json(reuniaoInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar reunião', error: error.message });
  }
};

// Atualizar reunião
exports.atualizar = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    // Atualizar campos
    Object.keys(req.body).forEach(key => {
      reuniao[key] = req.body[key];
    });

    await reuniao.save();

    await reuniao.populate([
      { path: 'organizador', select: 'nome email' },
      { path: 'participantes.usuario', select: 'nome email' },
      { path: 'projeto', select: 'nome' },
      { path: 'pauta.responsavel', select: 'nome email' },
      { path: 'decisoes.responsavel', select: 'nome email' }
    ]);

    res.json({
      message: 'Reunião atualizada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar reunião', error: error.message });
  }
};

// Confirmar presença
exports.confirmarPresenca = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    const participante = reuniao.participantes.find(
      p => p.usuario.toString() === req.usuario._id.toString()
    );

    if (!participante) {
      return res.status(404).json({ message: 'Você não é um participante desta reunião' });
    }

    participante.confirmado = true;
    await reuniao.save();

    await reuniao.populate('participantes.usuario', 'nome email');

    res.json({
      message: 'Presença confirmada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao confirmar presença', error: error.message });
  }
};

// Registrar presença
exports.registrarPresenca = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    const { participanteId } = req.params;
    const participante = reuniao.participantes.id(participanteId);

    if (!participante) {
      return res.status(404).json({ message: 'Participante não encontrado' });
    }

    participante.presenca = true;
    await reuniao.save();

    await reuniao.populate('participantes.usuario', 'nome email');

    res.json({
      message: 'Presença registrada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar presença', error: error.message });
  }
};

// Adicionar item à pauta
exports.adicionarPauta = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    reuniao.pauta.push(req.body);
    await reuniao.save();

    await reuniao.populate('pauta.responsavel', 'nome email');

    res.json({
      message: 'Item adicionado à pauta com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar item à pauta', error: error.message });
  }
};

// Adicionar decisão
exports.adicionarDecisao = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    reuniao.decisoes.push(req.body);
    await reuniao.save();

    await reuniao.populate('decisoes.responsavel', 'nome email');

    res.json({
      message: 'Decisão adicionada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar decisão', error: error.message });
  }
};

// Registrar ata
exports.registrarAta = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    reuniao.ata = {
      ...req.body,
      aprovada: false
    };

    await reuniao.save();

    res.json({
      message: 'Ata registrada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar ata', error: error.message });
  }
};

// Aprovar ata
exports.aprovarAta = async (req, res) => {
  try {
    const reuniao = await Reuniao.findById(req.params.id);

    if (!reuniao) {
      return res.status(404).json({ message: 'Reunião não encontrada' });
    }

    if (!reuniao.ata.conteudo) {
      return res.status(400).json({ message: 'Não há ata para ser aprovada' });
    }

    reuniao.ata.aprovada = true;
    reuniao.ata.aprovadoPor = req.usuario._id;
    reuniao.ata.dataAprovacao = new Date();

    await reuniao.save();

    await reuniao.populate('ata.aprovadoPor', 'nome email');

    res.json({
      message: 'Ata aprovada com sucesso',
      reuniao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar ata', error: error.message });
  }
}; 