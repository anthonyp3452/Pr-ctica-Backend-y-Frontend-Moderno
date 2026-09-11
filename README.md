# GymControl

Aplicación académica para que el personal de un gimnasio gestione socios, planes de membresía y asistencias. Stack: React + Vite (frontend), Express + SQLite (backend).

**Estado actual:** aplicación integrada. El frontend React consume la API Express/SQLite, usa JWT y permite gestionar socios, planes, membresías y asistencias.

| Rol | Persona |
| --- | --- |
| Frontend | Anthony |
| Backend / base de datos | Diego Merida |

## Requisitos

- **Node.js** LTS **≥ 20** (frontend comprobado con 22.20.0; backend con 22.22.0)
- npm 10+
- Git

La guía por fases es la referencia principal para organizar el trabajo. Cada integrante debe realizar sus propios aportes y commits con su identidad real.

## Estructura

```text
frontend/   # React (Anthony)
backend/    # Express + SQLite (Diego)
docs/       # Guía, contrato API, UX y evidencias
```

## Ejecutar el frontend

```bash
git clone https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno.git
cd Pr-ctica-Backend-y-Frontend-Moderno
cd frontend
npm ci
npm run dev
```

Abrir la dirección local que muestra Vite, normalmente http://127.0.0.1:5173.

Para compilar y consultar el resultado de producción:

```bash
npm run build
npm run preview
```

La vista de producción utiliza http://127.0.0.1:4173. Los scripts tienen puerto fijo y fallan con un mensaje si está ocupado; detener la instancia anterior antes de iniciar otra.

### Configuración frontend

Copiar `frontend/.env.example` a `frontend/.env` y conservar `VITE_API_URL=http://localhost:3000/api`. Las variables `VITE_` son públicas; no colocar `JWT_SECRET` ni credenciales en ellas.

### Funcionalidades del frontend

- Login con JWT y rutas protegidas.
- Dashboard con indicadores y actividad recientes reales.
- CRUD de socios, creación/activación de planes, asignación de membresías y registro de asistencias.
- Validaciones del navegador y mensajes de carga, vacío, error y éxito.
- Tema oscuro persistente, navegación móvil y diseño responsive.
- [Prototipo UX/UI](docs/ux/README.md).

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

## Documentación

- [Guía de desarrollo por fases](docs/GUIA_DESARROLLO.md)
- [Alcance inicial](PLAN.md)
- [Contrato API](docs/API.md)
- [Prototipo UX/UI](docs/ux/README.md)
- [Estado frontend](docs/ESTADO_FRONTEND.md)
- [Evidencia de verificación backend](docs/evidencias/backend-verificacion.md)
- [Evidencia de colaboración backend](docs/evidencias/backend-colaboracion.md)

## Puertos acordados

- Frontend: `5173`
- Backend: `3000`
- Prefijo API: `/api`
