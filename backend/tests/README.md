# Backend — autenticación y pruebas

## Crear usuario local

1. Copia variables de entorno:

```bash
cd backend
cp .env.example .env
```

2. Edita `.env` y define al menos:

- `JWT_SECRET` — secreto propio (no uses el valor de ejemplo en producción)
- `SEED_ADMIN_CORREO` — correo del administrador
- `SEED_ADMIN_PASSWORD` — contraseña local (no la subas al repositorio)

3. Prepara la base y el usuario:

```bash
npm install
npm run db:setup
```

`db:setup` aplica migraciones, datos de negocio de ejemplo y crea/actualiza el admin con hash bcrypt.

## Ejecutar el servidor

```bash
npm run dev
```

- Login: `POST http://localhost:3000/api/auth/login` con `{ "correo", "password" }`
- Perfil: `GET http://localhost:3000/api/auth/me` con header `Authorization: Bearer <token>`

## Ejecutar pruebas de autenticación

```bash
cd backend
npm test
```

Las pruebas usan una base SQLite temporal, no tocan `data/gymcontrol.sqlite`.
Cubren login válido/inválido, validación de campos, acceso sin token, token alterado y token expirado.
Verifican que las respuestas no incluyen `password` ni `password_hash`.
