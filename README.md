# GymControl

Aplicación académica para que el personal de un gimnasio gestione socios, planes de membresía y asistencias. Stack: React + Vite (frontend), Express + SQLite (backend).

## Integrantes

| Rol | Persona |
| --- | --- |
| Frontend | Anthony |
| Backend / base de datos | Diego Merida |

## Requisitos

- **Node.js** LTS **≥ 20** (verificado con v22.22.0)
- npm 10+
- Git

## Estructura

```text
frontend/   # React (Anthony)
backend/    # Express + SQLite (Diego)
docs/       # Guía, contrato API y evidencias
```

## Backend — instalación y ejecución

```bash
cd backend
cp .env.example .env
```

Edita `.env` y define al menos:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto HTTP (default `3000`) |
| `FRONTEND_ORIGIN` | Origen CORS (`http://localhost:5173`) |
| `JWT_SECRET` | Secreto propio (no uses el de ejemplo en producción) |
| `JWT_EXPIRES_IN` | Expiración del token (default `8h`) |
| `SQLITE_PATH` | Ruta del archivo SQLite |
| `GYM_TIMEZONE` | Zona para día local de asistencias (`America/Guatemala`) |
| `SEED_ADMIN_CORREO` | Correo del administrador local |
| `SEED_ADMIN_PASSWORD` | Contraseña local (no la subas al repo) |

```bash
npm install
npm run db:setup
npm run dev
```

- Health: `GET http://localhost:3000/api/health`
- Login: `POST http://localhost:3000/api/auth/login` con `{ "correo", "password" }`
- Contrato completo: [docs/API.md](docs/API.md)

### Scripts útiles

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor con recarga |
| `npm start` | Servidor de producción |
| `npm run db:migrate` | Aplica esquema SQLite |
| `npm run db:seed` | Datos de negocio de ejemplo |
| `npm run db:seed:admin` | Crea/actualiza admin con bcrypt |
| `npm run db:setup` | migrate + seed + admin |
| `npm test` | Suite de integración (25 tests) |
| `npm run verify` | Chequeo rápido de entrega (JWT / secretos) |

### Datos de ejemplo

El seed crea socios, planes, membresías y una asistencia de demostración. El usuario admin se crea con `SEED_ADMIN_*` del `.env` local.

No versionar: `node_modules/`, `.env`, ni archivos `.sqlite`.

## Frontend

Pendiente de integración por Anthony. Variable esperada: `VITE_API_URL=http://localhost:3000/api`.

## Documentación

- [Guía de desarrollo por fases](docs/GUIA_DESARROLLO.md)
- [Alcance inicial](PLAN.md)
- [Contrato API](docs/API.md)
- [Evidencia de verificación backend](docs/evidencias/backend-verificacion.md)
- [Evidencia de colaboración backend](docs/evidencias/backend-colaboracion.md)

## Puertos acordados

- Frontend: `5173`
- Backend: `3000`
- Prefijo API: `/api`
