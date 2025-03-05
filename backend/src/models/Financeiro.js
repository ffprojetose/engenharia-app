const { Model, DataTypes } = require('sequelize');

class Financeiro extends Model {
  static init(sequelize) {
    super.init({
      transacoes: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      orcamentos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      saldoAtual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      ultimaAtualizacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'financeiro'
    });

    return this;
  }

  static associate(models) {
    // Adicione aqui as associações necessárias
  }

  // Método para calcular saldo por período
  calcularSaldoPeriodo(dataInicio, dataFim) {
    const transacoesPeriodo = this.transacoes.filter(t => {
      return t.data >= dataInicio && t.data <= dataFim && t.status === 'pago';
    });

    return transacoesPeriodo.reduce((saldo, t) => {
      return t.tipo === 'receita' ? saldo + t.valor : saldo - t.valor;
    }, 0);
  }

  // Método para calcular fluxo de caixa
  calcularFluxoCaixa(dataInicio, dataFim) {
    const transacoesPeriodo = this.transacoes.filter(t => {
      return t.data >= dataInicio && t.data <= dataFim && t.status === 'pago';
    });

    return {
      receitas: transacoesPeriodo
        .filter(t => t.tipo === 'receita')
        .reduce((total, t) => total + t.valor, 0),
      despesas: transacoesPeriodo
        .filter(t => t.tipo === 'despesa')
        .reduce((total, t) => total + t.valor, 0)
    };
  }

  // Método para calcular gastos por categoria
  calcularGastosPorCategoria(dataInicio, dataFim) {
    const despesasPeriodo = this.transacoes.filter(t => {
      return t.tipo === 'despesa' && 
             t.data >= dataInicio && 
             t.data <= dataFim && 
             t.status === 'pago';
    });

    return despesasPeriodo.reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});
  }
}

module.exports = Financeiro; 