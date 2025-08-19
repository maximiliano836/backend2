import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Sesiones (usa cookie y almacenamiento en memoria para demo)
app.use(session({
  secret: 'supersecreto-dev',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 minutos
}));

// Parsers básicos
app.use(express.urlencoded({ extended: true }));

// Motor de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Exponer usuario a las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user?.role === 'admin';
  next();
});

// Rutas
app.use('/', authRouter);
app.use('/products', productsRouter);

// Home -> redirige a login o productos
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/products');
  return res.redirect('/login');
});

// 404 simple
app.use((req, res) => {
  res.status(404).send('No encontrado');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
