require('dotenv').config();
const { Sequelize } = require('sequelize');
const Projeto = require('../models/Projeto');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const config = require('../config/database');

const sequelize = new Sequelize(config.development);

async function createTestProject() {
  try {
    // Inicializar os modelos
    Usuario.init(sequelize);
    Cliente.init(sequelize);
    Projeto.init(sequelize);

    // Buscar um usuário admin
    const admin = await Usuario.findOne({ where: { tipo: 'admin' } });
    if (!admin) {
      throw new Error('Usuário admin não encontrado. Por favor, crie um usuário admin primeiro.');
    }
    
    // Buscar um cliente
    let cliente = await Cliente.findOne();
    
    // Se não houver cliente, criar um
    if (!cliente) {
      cliente = await Cliente.create({
        nome: 'Cliente Teste',
        tipo: 'pessoa_juridica',
        documento: '12345678901234',
        email: 'cliente@teste.com',
        telefone: '(11) 99999-9999',
        endereco: {
          cep: '01234-567',
          logradouro: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        ativo: true
      });
    }

    // Criar o projeto modelo
    const projetoTeste = await Projeto.create({
      nome: 'Projeto Modelo',
      descricao: 'Este é um projeto modelo para teste do sistema',
      cliente_id: cliente.id,
      responsavel_id: admin.id,
      data_inicio: new Date(),
      data_previsao_fim: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      status: 'em_planejamento',
      orcamento: {
        valorPrevisto: 100000.00,
        valorGasto: 0.00
      },
      documentos: [],
      observacoes: 'Projeto criado para teste'
    });
    
    console.log('Projeto modelo criado com sucesso!');
    console.log(JSON.stringify(projetoTeste, null, 2));
  } catch (error) {
    console.error('Erro ao criar projeto modelo:', error);
  } finally {
    await sequelize.close();
  }
}

createTestProject(); 