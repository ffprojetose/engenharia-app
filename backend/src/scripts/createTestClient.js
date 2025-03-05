require('dotenv').config();
const { Sequelize } = require('sequelize');
const Cliente = require('../models/Cliente');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function createTestClient() {
  try {
    // Inicializar o modelo
    Cliente.init(sequelize);

    await sequelize.sync();

    const clienteTeste = await Cliente.create({
      nome: 'Cliente Teste',
      tipo: 'pessoa_fisica',
      documento: '123.456.789-00',
      email: 'cliente@teste.com',
      telefone: '(11) 99999-9999',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 456',
        bairro: 'Bairro Teste',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true
    });
    
    console.log('Cliente teste criado com sucesso!');
    console.log(clienteTeste.toJSON());
  } catch (error) {
    console.error('Erro ao criar cliente teste:', error);
  } finally {
    await sequelize.close();
  }
}

createTestClient(); 