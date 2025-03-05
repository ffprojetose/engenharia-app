const { Model, DataTypes } = require('sequelize');

class Tarefa extends Model {
  static init(sequelize) {
    super.init({
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      prioridade: {
        type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
        defaultValue: 'media'
      },
      status: {
        type: DataTypes.ENUM('pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada'),
        defaultValue: 'pendente'
      },
      dataInicio: {
        type: DataTypes.DATE,
        allowNull: false
      },
      dataPrevisaoFim: {
        type: DataTypes.DATE,
        allowNull: false
      },
      dataFimReal: {
        type: DataTypes.DATE,
        allowNull: true
      },
      horasEstimadas: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      horasGastas: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      anexos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      comentarios: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      tags: {
        type: DataTypes.JSON,
        defaultValue: []
      }
    }, {
      sequelize,
      tableName: 'tarefas'
    });
  }

  static associate(models) {
    this.belongsTo(models.Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
    this.belongsTo(models.Usuario, { foreignKey: 'responsavel_id', as: 'responsavel' });
    this.belongsTo(models.Usuario, { foreignKey: 'criador_id', as: 'criador' });
  }

  // Método para verificar se a tarefa está atrasada
  verificarAtraso() {
    if (this.status === 'concluida' || this.status === 'cancelada') return false;
    
    const hoje = new Date();
    return hoje > this.dataPrevisaoFim;
  }

  // Método para calcular o tempo restante em dias
  calcularTempoRestante() {
    if (this.status === 'concluida' || this.status === 'cancelada') return 0;
    
    const hoje = new Date();
    const diff = this.dataPrevisaoFim - hoje;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

module.exports = Tarefa; 