const Fornecedor = require('../models/Fornecedor');

// Criar novo fornecedor
exports.criar = async (req, res) => {
  try {
    const fornecedor = new Fornecedor({
      ...req.body,
      criadoPor: req.usuario._id
    });

    await fornecedor.save();

    res.status(201).json({
      message: 'Fornecedor criado com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar fornecedor', error: error.message });
  }
};

// Listar todos os fornecedores
exports.listar = async (req, res) => {
  try {
    const { 
      status, 
      categoria, 
      busca,
      documentosVencidos 
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (status) query.status = status;
    if (categoria) query.categorias = categoria;
    if (busca) {
      query.$or = [
        { razaoSocial: new RegExp(busca, 'i') },
        { nomeFantasia: new RegExp(busca, 'i') },
        { cnpj: new RegExp(busca, 'i') }
      ];
    }

    const fornecedores = await Fornecedor.find(query)
      .populate('criadoPor', 'nome email')
      .sort({ razaoSocial: 1 });

    // Adicionar informações calculadas
    const fornecedoresComInfo = fornecedores.map(fornecedor => {
      const doc = fornecedor.toObject();
      doc.mediaAvaliacoes = fornecedor.calcularMediaAvaliacoes();
      doc.documentosVencidos = fornecedor.verificarDocumentosVencidos();
      return doc;
    });

    // Filtrar fornecedores com documentos vencidos se solicitado
    const fornecedoresFiltrados = documentosVencidos === 'true'
      ? fornecedoresComInfo.filter(f => f.documentosVencidos.length > 0)
      : fornecedoresComInfo;

    res.json(fornecedoresFiltrados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar fornecedores', error: error.message });
  }
};

// Buscar fornecedor por ID
exports.buscarPorId = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id)
      .populate('criadoPor', 'nome email')
      .populate('projetos', 'nome')
      .populate('avaliacoes.projeto', 'nome')
      .populate('avaliacoes.avaliador', 'nome email');

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    const fornecedorInfo = fornecedor.toObject();
    fornecedorInfo.mediaAvaliacoes = fornecedor.calcularMediaAvaliacoes();
    fornecedorInfo.documentosVencidos = fornecedor.verificarDocumentosVencidos();

    res.json(fornecedorInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar fornecedor', error: error.message });
  }
};

// Atualizar fornecedor
exports.atualizar = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    // Atualizar campos
    Object.keys(req.body).forEach(key => {
      fornecedor[key] = req.body[key];
    });

    await fornecedor.save();

    res.json({
      message: 'Fornecedor atualizado com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar fornecedor', error: error.message });
  }
};

// Adicionar avaliação
exports.adicionarAvaliacao = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    fornecedor.avaliacoes.push({
      ...req.body,
      avaliador: req.usuario._id
    });

    await fornecedor.save();

    await fornecedor.populate([
      { path: 'avaliacoes.projeto', select: 'nome' },
      { path: 'avaliacoes.avaliador', select: 'nome email' }
    ]);

    res.json({
      message: 'Avaliação adicionada com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar avaliação', error: error.message });
  }
};

// Adicionar produto
exports.adicionarProduto = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    fornecedor.produtos.push(req.body);
    await fornecedor.save();

    res.json({
      message: 'Produto adicionado com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
  }
};

// Atualizar status
exports.atualizarStatus = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    fornecedor.status = req.body.status;
    await fornecedor.save();

    res.json({
      message: 'Status atualizado com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status', error: error.message });
  }
};

// Adicionar documento
exports.adicionarDocumento = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findById(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }

    fornecedor.documentos.push(req.body);
    await fornecedor.save();

    res.json({
      message: 'Documento adicionado com sucesso',
      fornecedor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar documento', error: error.message });
  }
}; 