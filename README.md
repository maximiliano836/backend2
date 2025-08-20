# backend2

Proyecto Express básico con login/registro, sesiones y roles, usando solo MongoDB Atlas para guardar datos.

## Características
- Vistas EJS simples
- Login y Registro (usuarios en MongoDB)
- Rol admin si ingresás con `adminCoder@coder.com` y contraseña `admin123`
- Productos de ejemplo guardados en MongoDB
- Sesiones con `express-session` almacenadas en MongoDB

## Requisitos
- Node.js 18+
- Cuenta en MongoDB Atlas

## Configurar MongoDB Atlas (requerido)
1. Crea un cluster y un usuario con permisos de lectura/escritura.
2. En Network Access, permite tu IP (o 0.0.0.0/0 solo para desarrollo).
3. Crea `.env` a partir de `.env.example` y completa:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net
MONGODB_DB=sessionsdb
SESSION_SECRET=un-secreto-mas-largo-en-produccion
PORT=8080
```

## Cómo correr
1. npm install
2. npm run start
3. Abrí http://localhost:3000

## Rutas principales
- GET /login, POST /login
- GET /register, POST /register
- POST /logout
- GET /products (requiere sesión)

## Notas
- No subas `node_modules` al repo.