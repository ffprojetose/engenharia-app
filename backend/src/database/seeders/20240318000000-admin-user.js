'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = await bcrypt.hash('admin123', 10);
    
    return queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      email: 'admin@example.com',
      senha: senha,
      tipo: 'admin',
      cargo: 'Administrador',
      telefone: '(00) 00000-0000',
      ativo: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('usuarios', {
      email: 'admin@example.com'
    }, {});
  }
}; 