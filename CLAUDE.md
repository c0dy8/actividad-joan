# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI Support Desk — plataforma de gestión de tickets técnicos. Full stack: frontend con Vite + Vanilla JS + Bootstrap, backend con Node.js + Express + Prisma + PostgreSQL.

## Commands

### Backend
```bash
cd backend
cp .env.example .env      # configurar variables de entorno
npm install
npx prisma migrate dev    # crear tablas en la base de datos
npm run dev               # desarrollo con nodemon (puerto 3000)
npm start                 # producción
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # desarrollo con Vite (puerto 5173)
npm run build             # build para producción
```

### Docker (levantar todo junto)
```bash
docker-compose up --build
# Solo levanta postgres + backend. El frontend corre por separado con Vite.
```

## Architecture

### Backend — arquitectura por capas

```
Routes → Controllers → Services → Repositories → Prisma (PostgreSQL)
```

- **routes/**: define endpoints y aplica middleware de auth
- **controllers/**: recibe la request, llama al service, devuelve la response
- **services/**: lógica de negocio (validaciones, bcrypt, JWT)
- **repositories/**: todas las consultas a la base de datos via Prisma
- **middleware/auth.js**: verifica el JWT en el header `Authorization: Bearer <token>`

### Frontend — SPA con hash router

El router en `src/main.js` escucha el evento `hashchange` y renderiza la página correspondiente según el hash de la URL (`#login`, `#dashboard`, `#tickets`, `#tickets/:id`, `#tickets/new`).

- **services/api.js**: todas las llamadas `fetch` al backend
- **components/navbar.js**: navbar que se renderiza en `#navbar-container`
- **pages/**: cada archivo exporta una función que pinta el `#app` con innerHTML

### Base de datos

Modelos: `User`, `Ticket`, `Comment`.  
Enums: `Status` (OPEN, IN_PROGRESS, CLOSED) y `Priority` (LOW, MEDIUM, HIGH).

### Auth flow

1. Register/Login → backend devuelve `{ token, user }`
2. Frontend guarda token en `localStorage`
3. Cada request protegida lleva `Authorization: Bearer <token>`
4. `authMiddleware` verifica el token y pone `req.userId` para los controllers
