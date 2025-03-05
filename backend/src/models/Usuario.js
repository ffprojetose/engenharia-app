const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
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
        type: DataTypes.ENUM('admin', 'financeiro', 'membro'),
        defaultValue: 'membro'
      },
      cargo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      ultimo_acesso: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'usuarios',
      hooks: {
        beforeSave: async (usuario) => {
          if (usuario.changed('senha')) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        }
      }
    });
  }

  // Método para verificar senha
  async checkPassword(senha) {
    return bcrypt.compare(senha, this.senha);
  }

  // Definir associações
  static associate(models) {
    this.hasMany(models.Projeto, { foreignKey: 'responsavel_id', as: 'projetos_responsavel' });
    this.hasMany(models.Tarefa, { foreignKey: 'responsavel_id', as: 'tarefas' });
    this.hasMany(models.Reuniao, { foreignKey: 'organizador_id', as: 'reunioes_organizador' });
  }
}

module.exports = Usuario; 