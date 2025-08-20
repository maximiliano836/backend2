import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/', requireAuth, async (req, res) => {
  const items = await Product.find().lean();
  res.render('products/index', { items });
});

export default router;
