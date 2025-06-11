const express = require('express');
const router = express.Router();
const db = require('../db');  // ajuste o caminho se necessário

router.get('/', (req, res) => {
  const nome = req.query.nome || '';
  const sql = `SELECT * FROM estacionamentos WHERE nome LIKE ?`;
  const searchTerm = `%${nome}%`;

  db.query(sql, [searchTerm], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    res.json(results);
  });
});

module.exports = router;
