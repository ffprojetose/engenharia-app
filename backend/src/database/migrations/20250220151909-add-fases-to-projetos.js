'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remover a coluna status
    await queryInterface.removeColumn('projetos', 'status');

    // Adicionar a coluna fases
    await queryInterface.addColumn('projetos', 'fases', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: JSON.stringify([
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
      ])
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverter as alterações
    await queryInterface.removeColumn('projetos', 'fases');
    await queryInterface.addColumn('projetos', 'status', {
      type: Sequelize.ENUM('em_planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado'),
      defaultValue: 'em_planejamento'
    });
  }
};
