const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matheusem2027@gmail.com',
    pass: 'jucg fzng neal peeu' // App password do Gmail
  }
});

// Gera código de verificação de 6 dígitos
function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ CADASTRO
router.post('/cadastro', async (req, res) => {
  const { usuario, email, senha } = req.body;
  const codigo = gerarCodigo();

  try {
    const hashSenha = await bcrypt.hash(senha, 10);

    const query = 'INSERT INTO usuarios (usuario, email, senha, codigo, verificado) VALUES (?, ?, ?, ?, 0)';
    db.query(query, [usuario, email, hashSenha, codigo], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
      }

      const mailOptions = {
        from: 'matheusem2027@gmail.com',
        to: email,
        subject: 'Código de Verificação',
        text: `Olá ${usuario}, seu código de verificação é: ${codigo}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ erro: 'Erro ao enviar o e-mail.' });
        }
        res.json({ mensagem: 'Usuário cadastrado com sucesso! Verifique seu e-mail.' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

// ✅ LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: 'E-mail não encontrado.' });
    }

    const usuario = results[0];
    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    // Login OK
    res.json({ mensagem: 'Login realizado com sucesso.', email: usuario.email });
  });
});

// ✅ VERIFICAÇÃO DO CÓDIGO
router.post('/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND codigo = ?';
  db.query(query, [email, codigo], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ erro: 'Código incorreto ou email inválido.' });
    }

    const updateQuery = 'UPDATE usuarios SET verificado = 1 WHERE email = ?';
    db.query(updateQuery, [email], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ erro: 'Erro ao atualizar status de verificação.' });
      }

      res.json({ mensagem: 'Código verificado com sucesso!' });
    });
  });
});

module.exports = router;
