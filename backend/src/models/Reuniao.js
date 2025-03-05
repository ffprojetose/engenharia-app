const { Model, DataTypes } = require('sequelize');

class Reuniao extends Model {
  static init(sequelize) {
    super.init({
      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipo: {
        type: DataTypes.ENUM('interna', 'cliente', 'fornecedor'),
        allowNull: false
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false
      },
      horaInicio: {
        type: DataTypes.STRING,
        allowNull: false
      },
      horaFim: {
        type: DataTypes.STRING,
        allowNull: false
      },
      local: {
        type: DataTypes.JSON,
        allowNull: false
      },
      participantes: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      pauta: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      decisoes: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      ata: {
        type: DataTypes.JSON,
        defaultValue: {
          conteudo: null,
          aprovada: false,
          aprovadoPor: null,
          dataAprovacao: null
        }
      },
      anexos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('agendada', 'em_andamento', 'concluida', 'cancelada'),
        defaultValue: 'agendada'
      }
    }, {
      sequelize,
      tableName: 'reunioes'
    });
  }

  static associate(models) {
    this.belongsTo(models.Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
    this.belongsTo(models.Usuario, { foreignKey: 'organizador_id', as: 'organizador' });
    this.belongsTo(models.Usuario, { foreignKey: 'criador_id', as: 'criador' });
  }

  // Método para verificar se a reunião já começou
  verificarInicio() {
    const agora = new Date();
    const dataReuniao = new Date(this.data);
    const [hora, minuto] = this.horaInicio.split(':');
    
    dataReuniao.setHours(Number(hora), Number(minuto));
    
    return agora >= dataReuniao;
  }

  // Método para verificar se a reunião já terminou
  verificarFim() {
    const agora = new Date();
    const dataReuniao = new Date(this.data);
    const [hora, minuto] = this.horaFim.split(':');
    
    dataReuniao.setHours(Number(hora), Number(minuto));
    
    return agora > dataReuniao;
  }
}

module.exports = Reuniao; 