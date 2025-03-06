const sequelize = require('../config/database');

// Testar a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

// Importar os modelos aqui
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Projeto = require('../models/Projeto');
const Tarefa = require('../models/Tarefa');
const Reuniao = require('../models/Reuniao');
const Fornecedor = require('../models/Fornecedor');
const Financeiro = require('../models/Financeiro');

// Inicializar os modelos
const models = [
  Usuario,
  Cliente,
  Projeto,
  Tarefa,
  Reuniao,
  Fornecedor,
  Financeiro
];

models.forEach(model => model.init(sequelize));
models.forEach(model => model.associate && model.associate(sequelize.models));

module.exports = sequelize; 