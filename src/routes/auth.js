import { Router } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Ruta al archivo JSON de usuarios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/users.json');

function readUsers() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

function requireGuest(req, res, next) {
  if (req.session.user) return res.redirect('/products');
  next();
}

router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.redirect('/login');

  // Admin hardcodeado
  if (email === 'adminCoder@coder.com' && password === 'admin123') {
    req.session.user = { email, name: 'Admin', role: 'admin' };
    return res.redirect('/products');
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.redirect('/login');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.redirect('/login');

  req.session.user = { email: user.email, name: user.name, role: 'user' };
  res.redirect('/products');
});

router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.redirect('/register');

  const users = readUsers();
  const exists = users.some(u => u.email === email);
  if (exists) return res.redirect('/register');

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ name, email, passwordHash, role: 'user' });
  writeUsers(users);

  req.session.user = { email, name, role: 'user' };
  res.redirect('/products');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

export default router;
