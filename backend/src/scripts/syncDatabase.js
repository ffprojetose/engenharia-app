require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('../config/database');
const Usuario = require('../models/Usuario');

const sequelize = new Sequelize(config.development);

async function syncDatabase() {
  try {
    // Desabilitar verificação de chave estrangeira
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Inicializar o modelo
    Usuario.init(sequelize);

    // Forçar a recriação das tabelas
    await sequelize.sync({ force: true });
    
    // Criar usuário admin
    await Usuario.create({
      nome: 'Administrador',
      email: 'admin@example.com',
      senha: 'admin123',
      tipo: 'admin',
      cargo: 'Administrador',
      telefone: '(00) 00000-0000',
      ativo: true
    });

    // Criar usuário financeiro
    await Usuario.create({
      nome: 'Usuário Financeiro',
      email: 'financeiro@example.com',
      senha: 'financeiro123',
      tipo: 'financeiro',
      cargo: 'Analista Financeiro',
      telefone: '(11) 99999-9999',
      ativo: true
    });

    // Habilitar verificação de chave estrangeira novamente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Banco de dados sincronizado e usuários criados com sucesso!');
    console.log('\nCredenciais dos usuários:');
    console.log('\nAdministrador:');
    console.log('Email: admin@example.com');
    console.log('Senha: admin123');
    console.log('\nFinanceiro:');
    console.log('Email: financeiro@example.com');
    console.log('Senha: financeiro123');
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 