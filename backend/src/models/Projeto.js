const { Model, DataTypes } = require('sequelize');

class Projeto extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
          model: 'clientes', 
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      responsavel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
          model: 'usuarios', 
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false
      },
      data_previsao_fim: {
        type: DataTypes.DATE,
        allowNull: false
      },
      data_fim_real: {
        type: DataTypes.DATE,
        allowNull: true
      },
      fases: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [
          {
            nome: 'Estudo Preliminar',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Anteprojeto',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Projeto Executivo',
            duracao: 18,
            status: 'pendente'
          }
        ]
      },
      status: {
        type: DataTypes.ENUM('em_planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado'),
        defaultValue: 'em_planejamento'
      },
      orcamento: {
        type: DataTypes.JSON,
        defaultValue: {
          valorPrevisto: 0,
          valorGasto: 0
        }
      },
      documentos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'projetos',
      timestamps: true,
      underscored: true
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { 
      foreignKey: 'cliente_id', 
      as: 'cliente',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    
    this.belongsTo(models.Usuario, { 
      foreignKey: 'responsavel_id', 
      as: 'responsavel',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    
    this.hasMany(models.Tarefa, { 
      foreignKey: 'projeto_id', 
      as: 'tarefas' 
    });
    
    this.hasMany(models.Reuniao, { 
      foreignKey: 'projeto_id', 
      as: 'reunioes' 
    });
  }

  // Método para calcular o progresso do projeto
  calcularProgresso() {
    if (!this.tarefas || !this.tarefas.length) return 0;
    
    const tarefasConcluidas = this.tarefas.filter(
      tarefa => tarefa.status === 'concluida'
    ).length;
    
    return (tarefasConcluidas / this.tarefas.length) * 100;
  }

  // Método para verificar se o projeto está atrasado
  verificarAtraso() {
    if (this.status === 'concluido' || this.status === 'cancelado') return false;
    
    const hoje = new Date();
    return hoje > this.data_previsao_fim;
  }
}

module.exports = Projeto; 