const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipo: {
        type: DataTypes.ENUM('admin', 'membro'),
        defaultValue: 'membro'
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'usuarios',
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        }
      }
    });
  }
}

module.exports = Usuario; 