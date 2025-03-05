const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');
// ... outros imports ...

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
// ... outras rotas ...

module.exports = app; 