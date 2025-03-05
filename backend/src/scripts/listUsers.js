require('dotenv').config();
const { Sequelize } = require('sequelize');
const Usuario = require('../models/Usuario');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function listUsers() {
  try {
    // Inicializar o modelo
    Usuario.init(sequelize);

    // Buscar todos os usuários
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });
    
    console.log('Lista de Usuários:');
    console.log(JSON.stringify(usuarios, null, 2));
    
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  } finally {
    await sequelize.close();
  }
}

listUsers(); 