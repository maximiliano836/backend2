import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI; 
const DB_NAME = process.env.MONGODB_DB; 
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecreto-dev';

// Sesiones: guardadas en Mongo (requerido)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 },
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    dbName: DB_NAME,
    collectionName: 'sessions'
  })
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

async function start() {
  try {
    if (!MONGODB_URI || !DB_NAME) {
      throw new Error('Faltan variables .env: MONGODB_URI y/o MONGODB_DB');
    }
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error iniciando el servidor:', err);
    process.exit(1);
  }
}

start();
