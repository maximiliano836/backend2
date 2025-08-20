import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = Router();

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

  const mongoUser = await User.findOne({ email }).lean();
  if (!mongoUser) return res.redirect('/login');
  const ok = await bcrypt.compare(password, mongoUser.passwordHash);
  if (!ok) return res.redirect('/login');
  req.session.user = { email: mongoUser.email, name: mongoUser.name, role: mongoUser.role || 'user' };
  res.redirect('/products');
});

router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.redirect('/register');

  const existsMongo = await User.exists({ email });
  if (existsMongo) return res.redirect('/register');
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash, role: 'user' });
  req.session.user = { email, name, role: 'user' };
  return res.redirect('/products');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

export default router;
