const Financeiro = require('../models/Financeiro');
const Projeto = require('../models/Projeto');

// Criar nova transação
exports.criarTransacao = async (req, res) => {
  try {
    const financeiro = await Financeiro.findOne();
    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    const transacao = {
      ...req.body,
      criadoPor: req.usuario._id
    };

    financeiro.transacoes.push(transacao);

    // Atualizar saldo se a transação estiver paga
    if (transacao.status === 'pago') {
      const valor = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
      financeiro.saldoAtual += valor;
    }

    await financeiro.save();

    await financeiro.populate([
      { path: 'transacoes.projeto', select: 'nome' },
      { path: 'transacoes.fornecedor', select: 'razaoSocial' },
      { path: 'transacoes.cliente', select: 'nome' },
      { path: 'transacoes.criadoPor', select: 'nome email' }
    ]);

    res.status(201).json({
      message: 'Transação criada com sucesso',
      financeiro
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
  }
};

// Listar transações
exports.listarTransacoes = async (req, res) => {
  try {
    const { 
      tipo, 
      status, 
      projeto,
      dataInicio,
      dataFim,
      categoria 
    } = req.query;
    
    const financeiro = await Financeiro.findOne()
      .populate('transacoes.projeto', 'nome')
      .populate('transacoes.fornecedor', 'razaoSocial')
      .populate('transacoes.cliente', 'nome')
      .populate('transacoes.criadoPor', 'nome email');

    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    let transacoes = financeiro.transacoes;

    // Aplicar filtros
    if (tipo) {
      transacoes = transacoes.filter(t => t.tipo === tipo);
    }
    if (status) {
      transacoes = transacoes.filter(t => t.status === status);
    }
    if (projeto) {
      transacoes = transacoes.filter(t => t.projeto && t.projeto._id.toString() === projeto);
    }
    if (categoria) {
      transacoes = transacoes.filter(t => t.categoria === categoria);
    }
    if (dataInicio || dataFim) {
      transacoes = transacoes.filter(t => {
        const data = new Date(t.data);
        if (dataInicio && dataFim) {
          return data >= new Date(dataInicio) && data <= new Date(dataFim);
        }
        if (dataInicio) {
          return data >= new Date(dataInicio);
        }
        if (dataFim) {
          return data <= new Date(dataFim);
        }
        return true;
      });
    }

    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
  }
};

// Atualizar status da transação
exports.atualizarStatusTransacao = async (req, res) => {
  try {
    const financeiro = await Financeiro.findOne();
    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    const transacao = financeiro.transacoes.id(req.params.transacaoId);
    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    const statusAntigo = transacao.status;
    const { status } = req.body;

    // Atualizar saldo conforme mudança de status
    if (statusAntigo !== 'pago' && status === 'pago') {
      const valor = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
      financeiro.saldoAtual += valor;
    } else if (statusAntigo === 'pago' && status !== 'pago') {
      const valor = transacao.tipo === 'receita' ? -transacao.valor : transacao.valor;
      financeiro.saldoAtual += valor;
    }

    transacao.status = status;
    await financeiro.save();

    res.json({
      message: 'Status da transação atualizado com sucesso',
      financeiro
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status da transação', error: error.message });
  }
};

// Criar orçamento
exports.criarOrcamento = async (req, res) => {
  try {
    const financeiro = await Financeiro.findOne();
    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    const orcamento = {
      ...req.body,
      criadoPor: req.usuario._id
    };

    financeiro.orcamentos.push(orcamento);
    await financeiro.save();

    await financeiro.populate([
      { path: 'orcamentos.projeto', select: 'nome' },
      { path: 'orcamentos.criadoPor', select: 'nome email' },
      { path: 'orcamentos.aprovadoPor', select: 'nome email' }
    ]);

    res.status(201).json({
      message: 'Orçamento criado com sucesso',
      financeiro
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar orçamento', error: error.message });
  }
};

// Aprovar orçamento
exports.aprovarOrcamento = async (req, res) => {
  try {
    const financeiro = await Financeiro.findOne();
    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    const orcamento = financeiro.orcamentos.id(req.params.orcamentoId);
    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }

    orcamento.status = 'aprovado';
    orcamento.aprovadoPor = req.usuario._id;
    orcamento.dataAprovacao = new Date();

    await financeiro.save();

    // Atualizar orçamento do projeto
    await Projeto.findByIdAndUpdate(orcamento.projeto, {
      'orcamento.valorPrevisto': orcamento.valorTotal
    });

    await financeiro.populate([
      { path: 'orcamentos.projeto', select: 'nome' },
      { path: 'orcamentos.aprovadoPor', select: 'nome email' }
    ]);

    res.json({
      message: 'Orçamento aprovado com sucesso',
      financeiro
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar orçamento', error: error.message });
  }
};

// Obter relatório financeiro
exports.obterRelatorio = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ message: 'Período não especificado' });
    }

    const financeiro = await Financeiro.findOne();
    if (!financeiro) {
      return res.status(404).json({ message: 'Registro financeiro não encontrado' });
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const saldoPeriodo = financeiro.calcularSaldoPeriodo(inicio, fim);
    const fluxoCaixa = financeiro.calcularFluxoCaixa(inicio, fim);
    const gastosPorCategoria = financeiro.calcularGastosPorCategoria(inicio, fim);

    res.json({
      periodo: {
        inicio: dataInicio,
        fim: dataFim
      },
      saldoAtual: financeiro.saldoAtual,
      saldoPeriodo,
      fluxoCaixa,
      gastosPorCategoria
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
}; 