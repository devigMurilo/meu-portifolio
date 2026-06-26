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
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    console.warn(`CORS bloqueado para origem: ${origin}`);
    return callback(new Error('Origem não permitida.'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-admin-token'],
};

app.use(cors(corsOptions));
app.use(express.json());

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');

function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

function readSkills() {
  try {
    return JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeSkills(skills) {
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2), 'utf-8');
}

function readExperiences() {
  try {
    return JSON.parse(fs.readFileSync(EXPERIENCES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeExperiences(experiences) {
  fs.writeFileSync(EXPERIENCES_FILE, JSON.stringify(experiences, null, 2), 'utf-8');
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('ADMIN_USERNAME e ADMIN_PASSWORD devem ser definidos no .env');
  process.exit(1);
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_PASSWORD });
  }
  return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
});

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não enviado. Faça login novamente.' });
  }
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Token inválido. Faça login novamente.' });
  }
  next();
}

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

app.get('/api/projects', (req, res) => {
  const token = req.headers['x-admin-token'];
  const isAdmin = token === ADMIN_PASSWORD;
  const projects = readProjects();
  const filtered = isAdmin ? projects : projects.filter((p) => p.published);
  res.json(filtered);
});

app.post('/api/projects', requireAdmin, (req, res) => {
  const { title, description, stack, link, published } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }
  const projects = readProjects();
  const id = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
  const project = { id, title: title.trim(), description: description?.trim() || '', stack: stack || [], link: link?.trim() || '', published: !!published };
  projects.push(project);
  writeProjects(projects);
  res.status(201).json(project);
});

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, stack, link, published } = req.body;
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Projeto não encontrado.' });
  }
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }
  projects[index] = { id, title: title.trim(), description: description?.trim() || '', stack: stack || [], link: link?.trim() || '', published: !!published };
  writeProjects(projects);
  res.json(projects[index]);
});

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Projeto não encontrado.' });
  }
  const removed = projects.splice(index, 1)[0];
  writeProjects(projects);
  res.json(removed);
});

app.get('/api/skills', (req, res) => {
  const token = req.headers['x-admin-token'];
  const isAdmin = token === ADMIN_PASSWORD;
  const skills = readSkills();
  const filtered = isAdmin ? skills : skills.filter((s) => s.published);
  res.json(filtered);
});

app.post('/api/skills', requireAdmin, (req, res) => {
  const { name, icon, color, level, category, published } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório.' });
  }
  const skills = readSkills();
  const id = skills.length > 0 ? Math.max(...skills.map((s) => s.id)) + 1 : 1;
  const skill = { id, name: name.trim(), icon: icon || 'SiCode', color: color || '#38bdf8', level: Math.min(5, Math.max(1, level || 1)), category: category?.trim() || 'Geral', published: !!published };
  skills.push(skill);
  writeSkills(skills);
  res.status(201).json(skill);
});

app.put('/api/skills/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, icon, color, level, category, published } = req.body;
  const skills = readSkills();
  const index = skills.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Habilidade não encontrada.' });
  }
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório.' });
  }
  skills[index] = { id, name: name.trim(), icon: icon || skills[index].icon, color: color || skills[index].color, level: Math.min(5, Math.max(1, level || 1)), category: category?.trim() || skills[index].category, published: !!published };
  writeSkills(skills);
  res.json(skills[index]);
});

app.delete('/api/skills/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const skills = readSkills();
  const index = skills.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Habilidade não encontrada.' });
  }
  const removed = skills.splice(index, 1)[0];
  writeSkills(skills);
  res.json(removed);
});

app.get('/api/experiences', (req, res) => {
  const token = req.headers['x-admin-token'];
  const isAdmin = token === ADMIN_PASSWORD;
  const experiences = readExperiences();
  // Sort experiences by period descending simply (or leave as is). Let's just leave it ordered as saved.
  const filtered = isAdmin ? experiences : experiences.filter((e) => e.published);
  res.json(filtered);
});

app.post('/api/experiences', requireAdmin, (req, res) => {
  const { period, role, company, desc, published } = req.body;
  if (!role?.trim()) {
    return res.status(400).json({ error: 'Cargo/Papel é obrigatório.' });
  }
  const experiences = readExperiences();
  const id = experiences.length > 0 ? Math.max(...experiences.map((e) => e.id)) + 1 : 1;
  const experience = { 
    id, 
    period: period?.trim() || '', 
    role: role.trim(), 
    company: company?.trim() || '', 
    desc: desc?.trim() || '', 
    published: !!published 
  };
  experiences.push(experience);
  writeExperiences(experiences);
  res.status(201).json(experience);
});

app.put('/api/experiences/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { period, role, company, desc, published } = req.body;
  const experiences = readExperiences();
  const index = experiences.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Experiência não encontrada.' });
  }
  if (!role?.trim()) {
    return res.status(400).json({ error: 'Cargo/Papel é obrigatório.' });
  }
  experiences[index] = { 
    id, 
    period: period?.trim() || '', 
    role: role.trim(), 
    company: company?.trim() || '', 
    desc: desc?.trim() || '', 
    published: !!published 
  };
  writeExperiences(experiences);
  res.json(experiences[index]);
});

app.delete('/api/experiences/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const experiences = readExperiences();
  const index = experiences.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Experiência não encontrada.' });
  }
  const removed = experiences.splice(index, 1)[0];
  writeExperiences(experiences);
  res.json(removed);
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

