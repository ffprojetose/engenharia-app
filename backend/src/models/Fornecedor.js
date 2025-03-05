const { Model, DataTypes } = require('sequelize');

class Fornecedor extends Model {
  static init(sequelize) {
    super.init({
      razaoSocial: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nomeFantasia: {
        type: DataTypes.STRING
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      inscricaoEstadual: {
        type: DataTypes.STRING
      },
      endereco: {
        type: DataTypes.JSON,
        defaultValue: {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        }
      },
      contatos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      categorias: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      produtos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      avaliacoes: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      documentos: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      observacoes: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo', 'bloqueado'),
        defaultValue: 'ativo'
      },
      dataCadastro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      ultimaAtualizacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'fornecedores',
      hooks: {
        beforeSave: (fornecedor) => {
          fornecedor.ultimaAtualizacao = new Date();
        }
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'criador_id', as: 'criador' });
    this.belongsToMany(models.Projeto, { 
      through: 'fornecedor_projetos',
      foreignKey: 'fornecedor_id',
      as: 'projetos'
    });
  }

  // Método para calcular a média das avaliações
  calcularMediaAvaliacoes() {
    if (!this.avaliacoes.length) return 0;
    
    const soma = this.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    return soma / this.avaliacoes.length;
  }

  // Método para verificar se há documentos vencidos
  verificarDocumentosVencidos() {
    const hoje = new Date();
    return this.documentos.filter(doc => doc.dataValidade && new Date(doc.dataValidade) < hoje);
  }
}

module.exports = Fornecedor; 