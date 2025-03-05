const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM('pessoa_fisica', 'pessoa_juridica'),
        allowNull: false,
      },
      documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endereco: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      contatos: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    }, {
      sequelize,
      tableName: 'clientes',
    });
  }

  static associate(models) {
    this.hasMany(models.Projeto, { foreignKey: 'cliente_id', as: 'projetos' });
  }
}

module.exports = Cliente; 