# Contrato API — GymControl

Prefijo base: `/api`  
Origen frontend acordado: `http://localhost:5173`  
Puerto backend: `3000`

## Convenciones

| Tema | Regla |
| --- | --- |
| Éxito con cuerpo | `{ "data": ... }` |
| Error | `{ "error": { "code": "...", "message": "...", "fields": {} } }` |
| 200 | Consultas y ediciones |
| 201 | Creaciones |
| 204 | Eliminaciones (sin cuerpo) |
| 400 | Validación / formato inválido |
| 401 | Token ausente, inválido o expirado |
| 404 | Recurso inexistente |
| 409 | Conflicto (correo duplicado, plan con referencias, solapamiento, etc.) |
| Precios | Enteros en **centavos** (ej. Q250.00 → `25000`) |
| Fechas de membresía | `YYYY-MM-DD`, inclusivas: `fecha_fin = fecha_inicio + duracion_dias - 1` |
| Asistencias | Instantes en **UTC** (`ISO-8601`); el día local usa `GYM_TIMEZONE` |
| Auth | Salvo `/health` y `POST /auth/login`, enviar `Authorization: Bearer <token>` |

`fields` es un objeto opcional `{ "campo": "mensaje" }` para errores de formulario.

---

## Público

### `GET /health`

Comprueba que el servicio responde.

**Respuesta 200**

```json
{
  "data": {
    "status": "ok",
    "service": "gymcontrol-api",
    "timestamp": "2026-09-10T18:00:00.000Z"
  }
}
```

### `POST /auth/login`

**Body**

```json
{
  "correo": "admin@gymcontrol.local",
  "password": "••••••••"
}
```

| Campo | Reglas |
| --- | --- |
| correo | Requerido, formato email |
| password | Requerido, string no vacío |

**Respuesta 200**

```json
{
  "data": {
    "token": "<jwt>",
    "usuario": {
      "id": 1,
      "nombre": "Administrador GymControl",
      "correo": "admin@gymcontrol.local"
    }
  }
}
```

El JWT no incluye la contraseña ni el hash. Expira según `JWT_EXPIRES_IN` (por defecto `8h`).

**Errores**

| Código HTTP | `error.code` | Cuándo |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Campos faltantes o inválidos |
| 401 | `INVALID_CREDENTIALS` | Correo o contraseña incorrectos |

---

## Autenticación

### `GET /auth/me`

**Respuesta 200**

```json
{
  "data": {
    "id": 1,
    "nombre": "Administrador GymControl",
    "correo": "admin@gymcontrol.local"
  }
}
```

**Errores:** `401` (`UNAUTHORIZED`) sin token, token alterado o expirado.

---

## Dashboard

### `GET /dashboard`

Indicadores calculados desde SQLite.

**Respuesta 200**

```json
{
  "data": {
    "socios_activos": 12,
    "membresias_vencidas": 3,
    "asistencias_hoy": 5,
    "actividad_reciente": [
      {
        "tipo": "asistencia",
        "socio_id": 1,
        "socio_nombre": "Ana López",
        "ocurrido_en": "2026-09-10T14:30:00.000Z"
      }
    ]
  }
}
```

| Campo | Definición |
| --- | --- |
| `socios_activos` | Socios con al menos una membresía cuyo rango `[fecha_inicio, fecha_fin]` incluye el día local actual |
| `membresias_vencidas` | Membresías con `fecha_fin` anterior al día local actual (conteo de filas) |
| `asistencias_hoy` | Asistencias cuyo `dia_local` es el día actual en `GYM_TIMEZONE` |
| `actividad_reciente` | Últimas asistencias registradas (máx. 10), orden descendente |

---

## Socios

### `GET /socios`

Query opcional: `q` — busca en nombre, correo o teléfono (parcial, case-insensitive).

**Respuesta 200**

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Ana López",
      "correo": "ana.lopez@example.com",
      "telefono": "55510001",
      "fecha_alta": "2026-01-10"
    }
  ]
}
```

### `POST /socios`

**Body**

```json
{
  "nombre": "Diego Ruiz",
  "correo": "diego.ruiz@example.com",
  "telefono": "55520001"
}
```

| Campo | Reglas |
| --- | --- |
| nombre | Requerido, 2–120 caracteres |
| correo | Requerido, email único |
| telefono | Opcional, máx. 30 caracteres |

`fecha_alta` la asigna el servidor (día local actual).

**Respuesta 201:** socio creado en `data`.  
**Errores:** `400` validación; `409` (`CONFLICT`) correo duplicado.

### `GET /socios/:id`

**Respuesta 200:** un socio.  
**Errores:** `404` (`NOT_FOUND`).

### `PATCH /socios/:id`

Body parcial con los mismos campos que el alta (excepto `fecha_alta`, no editable).

**Respuesta 200:** socio actualizado.  
**Errores:** `400`, `404`, `409` (correo duplicado).

### `DELETE /socios/:id`

Elimina el socio y, en una transacción, sus membresías y asistencias (`ON DELETE CASCADE`).

**Respuesta 204** sin cuerpo.  
**Errores:** `404`.

---

## Planes

### `GET /planes`

Query opcional: `activo=true|false`. Sin filtro, lista todos.

**Respuesta 200**

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Mensual",
      "precio_centavos": 25000,
      "duracion_dias": 30,
      "activo": true
    }
  ]
}
```

### `POST /planes`

```json
{
  "nombre": "Semanal",
  "precio_centavos": 8000,
  "duracion_dias": 7
}
```

| Campo | Reglas |
| --- | --- |
| nombre | Requerido, 2–80 caracteres |
| precio_centavos | Entero ≥ 0 |
| duracion_dias | Entero ≥ 1 |

Nuevos planes nacen `activo: true`. **201** al crear.

### `PATCH /planes/:id`

Permite editar `nombre`, `precio_centavos`, `duracion_dias` y/o `activo`.  
Editar un plan **no** modifica membresías ya asignadas (conservan instantánea).

**200** al actualizar; `404` si no existe; `400` validación.

### `DELETE /planes/:id`

- Sin membresías que lo referencien: elimina (**204**).
- Con referencias: **409** (`CONFLICT`). Desactivar con `PATCH` `{ "activo": false }`.

---

## Membresías

### `GET /socios/:id/membresias`

Historial del socio, más reciente primero.

**Respuesta 200**

```json
{
  "data": [
    {
      "id": 1,
      "socio_id": 1,
      "plan_id": 1,
      "plan_nombre": "Mensual",
      "precio_centavos": 25000,
      "duracion_dias": 30,
      "fecha_inicio": "2026-09-01",
      "fecha_fin": "2026-09-30",
      "estado": "vigente"
    }
  ]
}
```

`estado`: `vigente` si el día local actual está entre inicio y fin (inclusive); `vencida` si el día es posterior a `fecha_fin`; `futura` si es anterior a `fecha_inicio`.

### `POST /socios/:id/membresias`

```json
{
  "plan_id": 1,
  "fecha_inicio": "2026-09-10"
}
```

El servidor:

1. Verifica socio y plan existentes.
2. Rechaza planes inactivos (**409**).
3. Calcula `fecha_fin = fecha_inicio + duracion_dias - 1`.
4. Guarda instantánea de `plan_nombre`, `precio_centavos`, `duracion_dias`.
5. Rechaza solapamiento con otra membresía del mismo socio (**409**): los rangos `[inicio, fin]` no pueden intersectarse.

**201** al crear. **404** socio/plan inexistente. **400** fechas inválidas.

---

## Asistencias

### `GET /asistencias`

Query opcional:

| Parámetro | Descripción |
| --- | --- |
| `socio_id` | Filtrar por socio |
| `desde` | Día local `YYYY-MM-DD` inclusive |
| `hasta` | Día local `YYYY-MM-DD` inclusive |

**Respuesta 200**

```json
{
  "data": [
    {
      "id": 1,
      "socio_id": 1,
      "socio_nombre": "Ana López",
      "registrado_en": "2026-09-10T14:30:00.000Z",
      "dia_local": "2026-09-10"
    }
  ]
}
```

### `POST /asistencias`

```json
{
  "socio_id": 1
}
```

Reglas de negocio:

1. El socio debe existir.
2. Debe tener membresía **vigente** en el día local actual.
3. Solo una asistencia por socio y `dia_local` (**409** `DUPLICATE_ATTENDANCE` si ya existe).
4. `registrado_en` se guarda en UTC; `dia_local` se deriva con `GYM_TIMEZONE`.

**201** al registrar. **404** socio. **409** sin membresía vigente (`NO_ACTIVE_MEMBERSHIP`) o duplicado.

---

## Modelo de datos (SQLite)

| Tabla | Campos principales |
| --- | --- |
| `usuarios` | id, nombre, correo único, password_hash |
| `socios` | id, nombre, correo único, telefono, fecha_alta |
| `planes` | id, nombre, precio_centavos, duracion_dias, activo |
| `membresias` | id, socio_id, plan_id, instantánea del plan, fecha_inicio, fecha_fin |
| `asistencias` | id, socio_id, registrado_en (UTC), dia_local; UNIQUE(socio_id, dia_local) |

Eliminar un socio elimina en cascada sus membresías y asistencias.

---

## Preparación local de la base

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
```

El seed carga socios, planes, membresías y asistencias de ejemplo. El usuario administrador se crea en la fase de autenticación.
