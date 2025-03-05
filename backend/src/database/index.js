const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const connection = new Sequelize(dbConfig.development);

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

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));

module.exports = connection; 