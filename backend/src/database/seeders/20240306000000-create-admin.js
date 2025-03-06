'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senha = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: senha,
      tipo: 'admin',
      ativo: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', { email: 'admin@admin.com' }, {});
  }
}; 