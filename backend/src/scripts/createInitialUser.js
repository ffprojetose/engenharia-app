require('dotenv').config();
const { Sequelize } = require('sequelize');
const Usuario = require('../models/Usuario');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function createInitialUser() {
  try {
    // Inicializar o modelo
    Usuario.init(sequelize);

    await sequelize.sync();

    const usuarioExistente = await Usuario.findOne({ where: { email: 'admin@example.com' } });
    
    if (!usuarioExistente) {
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@example.com',
        senha: 'admin123',
        tipo: 'admin',
        cargo: 'Administrador',
        telefone: '(00) 00000-0000',
        ativo: true
      });
      
      console.log('Usuário administrador criado com sucesso!');
      console.log('Email: admin@example.com');
      console.log('Senha: admin123');
    } else {
      console.log('Usuário administrador já existe!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await sequelize.close();
  }
}

createInitialUser(); 