const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
require('./database');

// Rotas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/projetos', require('./routes/projetos'));
app.use('/api/tarefas', require('./routes/tarefas'));
app.use('/api/reunioes', require('./routes/reunioes'));
// app.use('/api/parceiros', require('./routes/parceiros'));
app.use('/api/financeiro', require('./routes/financeiro'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 