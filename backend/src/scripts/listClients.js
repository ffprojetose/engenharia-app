require('dotenv').config();
const { Sequelize } = require('sequelize');
const Cliente = require('../models/Cliente');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function listClients() {
  try {
    // Inicializar o modelo
    Cliente.init(sequelize);

    await sequelize.sync();

    const clientes = await Cliente.findAll();
    
    console.log('Lista de Clientes:');
    console.log(JSON.stringify(clientes, null, 2));
    
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
  } finally {
    await sequelize.close();
  }
}

listClients(); 