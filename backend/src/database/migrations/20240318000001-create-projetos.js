'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projetos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      responsavel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      data_inicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      data_previsao_fim: {
        type: Sequelize.DATE,
        allowNull: false
      },
      data_fim_real: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('em_planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado'),
        defaultValue: 'em_planejamento'
      },
      orcamento: {
        type: Sequelize.JSON,
        defaultValue: {
          valorPrevisto: 0,
          valorGasto: 0
        }
      },
      documentos: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projetos');
  }
}; 