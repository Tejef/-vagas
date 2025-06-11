const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar rotas
const estacionamentosRoutes = require('./routes/estacionamentos');
const usuariosRoutes = require('./routes/usuarios');

const app = express(); // Defina o app antes de usar

const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos (CSS, imagens, JS)
app.use(express.static(__dirname));

// Rota da página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas da API
app.use('/usuarios', usuariosRoutes);
app.use('/estacionamentos', estacionamentosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
