# GymControl

Proyecto académico para gestionar socios, planes de membresía y asistencias de un gimnasio con React, Express y SQLite.

**Estado actual: frontend de fase 1.** React tiene ocho pantallas y navegación con datos ficticios. Todavía no hay autenticación, backend ni operaciones de escritura conectadas.

## Empezar aquí

Leer la **[guía de desarrollo por fases](docs/GUIA_DESARROLLO.md)**: contiene responsabilidades para los dos desarrolladores, instrucciones paso a paso, 25 commits previstos, dependencias entre tareas y criterios para verificar los 15 requisitos de entrega.

- Anthony: frontend React.
- Segundo integrante: backend y base de datos; nombre pendiente de completar.
- [Alcance inicial](PLAN.md).

La guía por fases es la referencia principal para organizar el trabajo. Cada integrante debe realizar sus propios aportes y commits con su identidad real.

## Ejecutar el frontend

Requisitos: Git y Node.js 22.12 o superior (desarrollo comprobado con Node 22.20.0 y npm 10.9.3).

```bash
git clone https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno.git
cd Pr-ctica-Backend-y-Frontend-Moderno
# Mientras el PR de fase 1 esté pendiente:
git switch feat/frontend-fase-1
cd frontend
npm ci
npm run dev
```

Abrir la dirección local que muestra Vite, normalmente http://127.0.0.1:5173. Una vez integrado el PR, estos archivos estarán disponibles en main y no será necesario cambiar de rama.

Para compilar y consultar el resultado de producción:

```bash
npm run build
npm run preview
```

La vista de producción utiliza http://127.0.0.1:4173. Los scripts tienen puerto fijo y fallan con un mensaje si está ocupado; detener la instancia anterior antes de iniciar otra.

### Configuración

`frontend/.env.example` documenta `VITE_API_URL=http://localhost:3000/api`. No es necesario crear `.env` en esta fase, porque no hay llamadas al backend. Al iniciar la integración, copiar el ejemplo a `.env` y ajustar el origen acordado con el compañero. Las variables VITE_ son públicas; no colocar JWT_SECRET ni credenciales en ellas.

### Qué se puede revisar ahora

- Dashboard, socios, detalle, alta, edición, planes, asistencias y login.
- Navegación principal y enlaces entre listado, detalle y formularios; ruta 404 e ids desconocidos.
- Búsqueda y filtros sobre los datos ficticios de socios y asistencias.
- Navegación móvil mediante el botón de menú.
- [Prototipo UX/UI](docs/ux/README.md) y [estado del trabajo frontend](docs/ESTADO_FRONTEND.md).

Login, guardado, eliminación, creación de planes y registro de entradas están pendientes de sus fases de integración. Los botones de escritura están deshabilitados y no simulan éxito. La fecha del encabezado también es de ejemplo, no la fecha actual. Las rutas todavía no están protegidas. El tema oscuro se especifica en el prototipo; su implementación persistente corresponde a C06.

La tipografía usa DM Sans desde Google Fonts con alternativa local Segoe UI/Arial si no hay red. Los iconos Lucide se incluyen en el bundle. Ninguna funcionalidad depende de servicios de imágenes.

## Backend

Su desarrollo pertenece al segundo integrante. Aún no hay servicio ejecutable ni instrucciones reales de base de datos en esta rama; se añadirán con C04/C05 y la integración posterior.
