const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o banco de dados
require('./database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/projetos', require('./routes/projetos'));
app.use('/api/clientes', require('./routes/clientes'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sistema de Gestão para Engenharia e Construção' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 