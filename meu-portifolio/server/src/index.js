const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    console.warn(`CORS bloqueado para origem: ${origin}`);
    return callback(new Error('Origem não permitida.'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`Aviso: variável de ambiente ${envVar} não foi definida.`);
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e mensagem.' });
  }

  const htmlMessage = `
    <h1>Novo contato pelo portfólio</h1>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${message.replace(/\n/g, '<br />')}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || `"Portfólio" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.MAIL_TO,
      subject: `Novo contato de ${name}`,
      text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
      html: htmlMessage,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    return res.status(500).json({
      error: 'Não foi possível enviar a mensagem. Tente novamente em instantes.',
    });
  }
});

const distPath = path.resolve(__dirname, '..', '..', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
      return next();
    }
    return res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      message: 'Servidor backend está online, mas o build do front não foi encontrado.',
      version: '1.0.0',
    });
  });
}

app.use((err, _req, res, _next) => {
  if (err.message === 'Origem não permitida.') {
    return res.status(403).json({ error: err.message });
  }
  console.error('Erro não tratado:', err);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

