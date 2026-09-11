# GymControl — Plan de trabajo

Sistema web para el personal de un gimnasio. Permite gestionar socios, planes, membresías y asistencias. Primera versión sin cobros en línea.

## Tecnologías propuestas

- Frontend: React, Vite y React Router.
- Backend: Node.js y Express.
- Base de datos: SQLite.
- Autenticación: contraseña almacenada mediante hash y JWT verificado por el backend. El token no debe contener contraseñas.
- Monorepositorio: `frontend/`, `backend/` y `docs/`.

## Reparto para dos desarrolladores

| Responsable | Entregables |
| --- | --- |
| Desarrollador 1: backend | Base de datos, migraciones, datos de ejemplo, login, JWT, endpoints, validaciones del servidor y pruebas de integración |
| Desarrollador 2: frontend | Prototipo UX/UI, React, rutas, componentes reutilizables, formularios, integración con API, temas persistentes y responsive |
| Ambos | Contrato API, integración, revisión cruzada, README, demostración y commits propios |

Todavía falta asignar estas funciones a los nombres de los integrantes.

## Pantallas y rutas

1. `/login`: acceso del personal.
2. `/dashboard`: socios activos, membresías vencidas y asistencias del día.
3. `/socios`: listado, búsqueda, filtros y estado vacío.
4. `/socios/nuevo`: formulario de registro.
5. `/socios/:id`: datos, membresías y asistencias del socio.
6. `/socios/:id/editar`: edición de datos.
7. `/planes`: gestión de planes de membresía.
8. `/asistencias`: registro y consulta de entradas.

Todas las rutas salvo login requieren autenticación. Las restricciones también deben aplicarse en el servidor.

## Modelo de datos

- usuarios: id, nombre, correo único, hash de contraseña.
- socios: id, nombre, correo único, teléfono, fecha de alta.
- planes: id, nombre, precio en centavos, duración en días, activo.
- membresías: id, socio, plan, fecha de inicio, fecha de fin.
- asistencias: id, socio, fecha y hora.

Un plan utilizado se desactiva en vez de eliminarse. La eliminación de un socio requiere confirmación y elimina sus membresías y asistencias en una transacción. Validar esta política antes de cargar datos reales.

## Contrato API inicial

Prefijo: `/api`. Salvo login, enviar `Authorization: Bearer <token>`.

| Método | Ruta | Función |
| --- | --- | --- |
| POST | /auth/login | Recibe correo y contraseña; devuelve token y usuario |
| GET | /auth/me | Usuario autenticado |
| GET | /dashboard | Indicadores calculados de la base de datos |
| GET, POST | /socios | Consultar o crear socios |
| GET, PATCH, DELETE | /socios/:id | Consultar, editar o eliminar un socio |
| GET, POST | /planes | Consultar o crear planes |
| PATCH, DELETE | /planes/:id | Editar o eliminar un plan sin referencias |
| POST | /socios/:id/membresias | Asignar plan y fecha de inicio; el servidor calcula fecha de fin |
| GET | /socios/:id/membresias | Historial de membresías |
| GET, POST | /asistencias | Consultar o registrar asistencia |

Respuestas correctas: `{ "data": ... }`. Errores: `{ "error": { "code": "...", "message": "...", "fields": {} } }`.
Usar 200 para consultas y ediciones, 201 para creaciones, 204 para eliminaciones, 400 para validación, 401 para token inválido, 404 para registro inexistente y 409 para conflictos.
Precios en centavos; fechas de membresía como YYYY-MM-DD; instantes de asistencia en UTC. Mostrar las asistencias en la zona horaria configurada del gimnasio.

## Orden de implementación

1. Acordar contrato API, realizar prototipo y preparar carpetas.
2. Backend: base de datos y autenticación. Frontend: navegación, componentes, temas y formularios.
3. Integrar login y CRUD de socios con datos reales.
4. Integrar planes, asignación de membresías, asistencias y dashboard.
5. Verificar errores, estados vacíos, validaciones y diseño móvil.
6. Documentar instalación y ejecución, realizar una prueba desde un clon nuevo y preparar evidencias.

## Git y evidencia de colaboración

Cada integrante configura su identidad real de Git y utiliza su propia cuenta de GitHub. No fabricar autores ni atribuir aportes de una persona a otra.

- Ramas sugeridas: `feat/backend-auth`, `feat/frontend-login`, `feat/backend-socios`, `feat/frontend-socios`.
- Hacer commits por cambios coherentes: por ejemplo, `feat: agregar validación de socios`.
- Abrir pull requests y pedir revisión al compañero.
- Conservar evidencia del historial y de los pull requests de ambos integrantes.
- Evitar subir node_modules, archivos .env, tokens o bases de datos con información personal.

## Lista de aceptación

- [ ] Repositorio actualizado con contribuciones de ambos integrantes.
- [ ] React ejecutándose y cinco pantallas como mínimo.
- [ ] Prototipo UX/UI guardado y diseño implementado coherente con él.
- [ ] Componentes reutilizables y rutas protegidas.
- [ ] Consumo real de API y datos persistentes tras reiniciar.
- [ ] CRUD completo de socios desde la interfaz.
- [ ] Login y verificación JWT en endpoints privados.
- [ ] Validaciones en cliente y servidor.
- [ ] Tema oscuro conservado al recargar.
- [ ] Interfaz usable en móvil y escritorio.
- [ ] Estados Loading, Empty, Error y Success visibles donde corresponda.
- [ ] README con requisitos, variables de entorno, instalación, datos de ejemplo y ejecución de ambos servicios.
- [ ] Historial de commits y pull requests de los dos desarrolladores.

Estado actual: planificación inicial; la aplicación todavía no está implementada.
