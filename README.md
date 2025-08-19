# backend2

Proyecto Express básico y simplificado (principiante) con login/registro, sesiones (cookie), roles y almacenamiento en archivo.

## Características
- Vistas EJS simples (sin layouts ni estáticos)
- Login y Registro (usuarios guardados en `data/users.json`)
- Rol admin si ingresás con `adminCoder@coder.com` y contraseña `admin123`
- Redirección a `/products` luego de login/registro
- Bienvenida en productos con datos del usuario logueado
- Sesiones con `express-session` (cookie de sesión)

## Requisitos
- Node.js 18+

## Cómo correr
1. Instalar dependencias
2. Iniciar el servidor
3. Abrir http://localhost:3000

## Rutas principales
- `GET /login` – formulario de login
- `POST /login` – procesa login
- `GET /register` – formulario de registro
- `POST /register` – procesa registro
- `POST /logout` – cierra sesión
- `GET /products` – requiere sesión; muestra productos y saludo

## Notas
- Usuarios se guardan en `data/users.json` (simple file storage para demo)
- No subas `node_modules` al repo.