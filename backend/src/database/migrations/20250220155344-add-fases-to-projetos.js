'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('projetos', 'fases', {
      type: Sequelize.JSON,
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('projetos', 'fases');
  }
};
