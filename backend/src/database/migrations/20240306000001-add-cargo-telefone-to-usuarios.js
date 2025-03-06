'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'cargo', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Não especificado'
    });

    await queryInterface.addColumn('usuarios', 'telefone', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuarios', 'cargo');
    await queryInterface.removeColumn('usuarios', 'telefone');
  }
}; 