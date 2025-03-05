require('dotenv').config();
const { Sequelize } = require('sequelize');
const Usuario = require('../models/Usuario');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function createFinanceiroUser() {
  try {
    // Inicializar o modelo
    Usuario.init(sequelize);

    await sequelize.sync();

    const usuarioExistente = await Usuario.findOne({ where: { email: 'financeiro@example.com' } });
    
    if (!usuarioExistente) {
      await Usuario.create({
        nome: 'Usuário Financeiro',
        email: 'financeiro@example.com',
        senha: 'financeiro123',
        tipo: 'financeiro',
        cargo: 'Analista Financeiro',
        telefone: '(11) 99999-9999',
        ativo: true
      });
      
      console.log('Usuário financeiro criado com sucesso!');
      console.log('Email: financeiro@example.com');
      console.log('Senha: financeiro123');
    } else {
      console.log('Usuário financeiro já existe!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await sequelize.close();
  }
}

createFinanceiroUser(); 