import { Router } from 'express';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/', requireAuth, (req, res) => {
  const items = [
    { id: 1, name: 'Producto A', price: 10 },
    { id: 2, name: 'Producto B', price: 20 },
    { id: 3, name: 'Producto C', price: 30 }
  ];
  res.render('products/index', { items });
});

export default router;
