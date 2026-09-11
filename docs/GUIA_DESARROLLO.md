# GymControl: guía de desarrollo por fases

## Objetivo y responsables

Construir una aplicación web para que el personal de un gimnasio gestione socios, planes, membresías y asistencias. No incluye pagos en línea, nutrición ni aplicación para clientes.

| Responsable | Trabajo principal |
|---|---|
| Anthony (frontend) | Prototipo, React, navegación, componentes, formularios, integración, temas y responsive |
| Compañero/a (backend; completar nombre) | Express, SQLite, autenticación JWT, reglas de negocio, endpoints y pruebas |
| Ambos | Acordar API, revisar pull requests, probar integración y documentar |

**Plan: 25 commits de trabajo, incluidos 13 de Anthony y 12 del compañero.** El primero publica esta planificación; los otros 24 corresponden a seis fases con dos commits por persona en cada fase. Es una estimación de organización, no una cuota académica: si se requieren correcciones, agregar commits reales. Los commits de merge pueden aumentar el total. Nunca crear commits vacíos ni usar la identidad del compañero para simular participación.

Los identificadores C01–C25 son referencias del plan, no hashes de Git ni una secuencia obligatoria entre tareas independientes. Cada commit se realiza cuando su resultado funciona y puede revisarse.

## Preparación y reglas de colaboración

1. El propietario invita al compañero en Settings → Collaborators; el compañero acepta.
2. Cada uno instala Git y una misma versión LTS compatible de Node.js. Registrar la versión acordada en el README al preparar el proyecto.
3. Cada uno clona el repositorio en su equipo:

   ```bash
   git clone https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno.git
   cd Pr-ctica-Backend-y-Frontend-Moderno
   git config user.name "Tu nombre real"
   git config user.email "Tu correo vinculado a GitHub"
   ```

4. Crear ramas desde `main` actualizado; no trabajar ambos directamente en `main`.
5. Anthony modifica principalmente `frontend/`; el compañero, `backend/`. Coordinar cambios a `docs/` y README.
6. Abrir un pull request por persona y fase. Incluir qué cambió y cómo probarlo. El otro integrante revisa antes de integrar.
7. Usar merge normal para conservar los commits previstos y su autoría. Evitar squash si necesitan mostrar cada commit por separado.
8. No versionar `node_modules`, `.env`, tokens, contraseñas reales ni archivos de base de datos. Sí versionar archivos de bloqueo de dependencias, migraciones y `.env.example` sin secretos.
9. Una fase termina únicamente cuando se cumplen sus criterios de salida y ambos cambios están integrados.

Estructura prevista:

```text
frontend/
  src/
    components/
    pages/
    services/
    context/
    styles/
backend/
  src/
    routes/
    middleware/
    services/
    db/
  tests/
docs/
  GUIA_DESARROLLO.md
  API.md
  ux/
  evidencias/
README.md
```

## Fase 0 — Publicar y acordar el plan

**C01 · Anthony · `docs: agregar plan de desarrollo de GymControl`**

1. Publicar esta guía, el alcance inicial y el README de entrada.
2. El compañero lee el documento y ambos confirman responsabilidades.
3. Acordar puertos: frontend `5173`, backend `3000`; prefijo API `/api`.
4. Completar el nombre del compañero en una futura actualización de documentación.

Salida: ambos tienen acceso al repositorio y entienden las fases. La aplicación todavía no existe en esta fase.

## Fase 1 — Diseño, estructura y contrato

Ramas: `feat/frontend-fase-1` y `feat/backend-fase-1`.

### Anthony

**C02 · `docs(frontend): agregar prototipo UX UI de GymControl`**

1. Dibujar login, dashboard, socios, detalle, alta, edición, planes y asistencias.
2. Definir colores, tipografía, navegación, espaciados y variantes clara/oscura.
3. Diseñar al menos login, dashboard y socios también en móvil.
4. Guardar imágenes exportadas y, si aplica, enlace accesible al prototipo en `docs/ux/`.

**C03 · `feat(frontend): inicializar React y rutas principales`**

1. Crear `frontend/` con React y Vite; instalar React Router.
2. Crear las ocho rutas y páginas iniciales indicadas abajo.
3. Crear layout de navegación y página para ruta inexistente.
4. Agregar `.env.example` con `VITE_API_URL=http://localhost:3000/api` y excluir `.env` y `node_modules`.
5. Comprobar que la aplicación arranca y navegar entre rutas.

### Compañero

**C04 · `feat(backend): inicializar Express y configuracion del servidor`**

1. Crear `backend/` con Express y scripts de desarrollo/arranque.
2. Configurar JSON, CORS para el origen acordado y manejo central de errores.
3. Crear `GET /api/health` y comprobar respuesta correcta.
4. Crear `.env.example` con PORT, FRONTEND_ORIGIN, JWT_SECRET y ruta de SQLite, sin secretos reales.

**C05 · `feat(backend): definir esquema SQLite y contrato API`**

1. Crear migraciones para usuarios, socios, planes, membresías y asistencias, con claves foráneas.
2. Guardar precios en centavos enteros y definir correo de socio único.
3. Documentar en `docs/API.md` campos, ejemplos JSON, validaciones y códigos de estado para todas las rutas.
4. Añadir comando de preparación de base de datos y datos ficticios reproducibles.
5. Revisar el contrato con Anthony antes de continuar.

Salida: ambos servicios arrancan, SQLite se inicializa y el contrato API está acordado. Los datos temporales del frontend se identifican como ejemplos.

## Fase 2 — Login y base visual

Ramas: `feat/frontend-fase-2` y `feat/backend-fase-2`.

### Anthony

**C06 · `feat(frontend): crear componentes y tema persistente`**

1. Crear Button, Input, Card, Alert, Loading y modal de confirmación reutilizables.
2. Implementar tema claro/oscuro y persistir únicamente esa preferencia en localStorage.
3. Adaptar navegación a móvil, indicar foco de teclado y asociar etiquetas a inputs.
4. Comprobar que el tema se conserva al recargar.

**C07 · `feat(frontend): integrar login JWT y rutas protegidas`**

1. Crear un cliente HTTP central usando VITE_API_URL.
2. Validar correo y contraseña requeridos; enviar login al backend.
3. Guardar JWT en memoria mediante contexto de autenticación y enviarlo como Bearer. Al recargar, se vuelve a iniciar sesión en esta primera versión.
4. Proteger rutas, implementar logout y volver al login si la API responde 401.
5. Mostrar carga, credenciales incorrectas y error de conexión; desactivar envío mientras está pendiente.

### Compañero

**C08 · `feat(backend): implementar login y verificacion JWT`**

1. Crear usuario inicial a partir de credenciales locales documentadas en el procedimiento de seed, sin subir una contraseña real.
2. Almacenar contraseñas con hash mediante biblioteca adecuada; no devolver hashes.
3. Implementar POST /auth/login con expiración de token y GET /auth/me.
4. Crear middleware que verifique firma y expiración. Proteger todos los endpoints de negocio.

**C09 · `test(backend): verificar autenticacion y errores de acceso`**

1. Probar login válido e inválido, campos faltantes y respuestas sin datos sensibles.
2. Probar acceso sin token, token alterado y token expirado.
3. Documentar cómo ejecutar estas pruebas y cómo crear el usuario local.

Salida: login real desde React; un usuario sin token no accede a datos privados aunque llame directamente a la API. Anthony integra C07 después de que C08 esté disponible.

## Fase 3 — CRUD completo de socios

Ramas: `feat/frontend-fase-3` y `feat/backend-fase-3`.

### Anthony

**C10 · `feat(frontend): conectar listado y detalle de socios`**

1. Consultar la API y mostrar socios con búsqueda.
2. Abrir detalle mediante el id de la ruta.
3. Mostrar Loading, Empty y Error con reintento; distinguir búsqueda sin resultados de lista sin registros.

**C11 · `feat(frontend): implementar alta edicion y eliminacion de socios`**

1. Reutilizar un formulario para alta y edición.
2. Validar nombre, correo y teléfono según el contrato; mostrar errores de campos del servidor.
3. Agregar eliminación con confirmación explícita.
4. Mostrar Success y actualizar listado/detalle después de guardar o eliminar.
5. Impedir envíos duplicados mientras se procesa una operación.

### Compañero

**C12 · `feat(backend): implementar CRUD de socios`**

1. Implementar listado con búsqueda, detalle, creación, edición y eliminación.
2. Validar campos en el servidor y resolver correo duplicado con 409.
3. Responder 404 para ids inexistentes y 400 para formatos inválidos.
4. Usar consultas parametrizadas y transacción para eliminar socio y sus registros dependientes según el contrato.

**C13 · `test(backend): cubrir CRUD y persistencia de socios`**

1. Probar crear, consultar, editar y eliminar.
2. Probar duplicados, datos inválidos e ids inexistentes.
3. Verificar claves foráneas y que un socio guardado sigue presente tras reabrir la base de datos.

Salida: ambos demuestran el CRUD completo desde React y los cambios persisten. C10/C11 se integran con C12, sin sustituir el backend por localStorage.

## Fase 4 — Planes y membresías

Ramas: `feat/frontend-fase-4` y `feat/backend-fase-4`.

### Anthony

**C14 · `feat(frontend): implementar gestion de planes`**

1. Listar, crear y editar nombre, precio y duración.
2. Permitir eliminar un plan sin referencias y desactivar un plan utilizado.
3. Mostrar validaciones y confirmaciones; convertir el importe visible a centavos para la API.

**C15 · `feat(frontend): asignar membresias desde detalle de socio`**

1. Consultar planes activos y permitir seleccionar plan y fecha de inicio.
2. Enviar asignación y mostrar fecha de fin calculada por el servidor.
3. Mostrar historial y estado vigente/vencido conforme al contrato.

### Compañero

**C16 · `feat(backend): implementar planes y asignacion de membresias`**

1. Implementar rutas de planes y membresías del contrato.
2. Validar precio entero no negativo y duración entera positiva.
3. Bloquear eliminación de planes referenciados con 409; permitir desactivación.
4. Calcular vencimiento en servidor y conservar duración/precio contratados como instantánea de la membresía.
5. Rechazar periodos superpuestos para el mismo socio y nuevas asignaciones de planes inactivos.

**C17 · `test(backend): verificar vigencia y reglas de membresias`**

1. Probar fechas límite, solapamientos, plan inexistente/inactivo y socio inexistente.
2. Probar que editar un plan no modifica membresías ya asignadas.
3. Acordar y documentar que inicio y fin son fechas inclusivas: fin = inicio + duración en días - 1.

Salida: se crea un plan desde React, se asigna a un socio y se consulta su vigencia real.

## Fase 5 — Asistencias y dashboard

Ramas: `feat/frontend-fase-5` y `feat/backend-fase-5`.

### Anthony

**C18 · `feat(frontend): integrar registro e historial de asistencias`**

1. Seleccionar socio y registrar entrada desde la interfaz.
2. Consultar historial con filtro de fecha y socio.
3. Mostrar mensajes específicos para membresía vencida y asistencia duplicada del día.

**C19 · `feat(frontend): conectar dashboard con indicadores reales`**

1. Mostrar socios con membresía vigente, membresías vencidas y asistencias del día.
2. Mostrar actividades recientes con enlaces al detalle del socio.
3. Agregar estados de carga, vacío, error y reintento; eliminar cifras de ejemplo.

### Compañero

**C20 · `feat(backend): implementar asistencias e indicadores`**

1. Crear GET/POST /asistencias y GET /dashboard.
2. Exigir membresía vigente para registrar entrada y permitir una asistencia por socio y día local.
3. Guardar el instante en UTC y calcular el día según zona horaria configurada del gimnasio.
4. Calcular indicadores desde SQLite; documentar exactamente qué cuenta cada indicador.

**C21 · `test(backend): cubrir asistencias y calculos del dashboard`**

1. Probar entrada válida, socio sin membresía, vencimiento y duplicados.
2. Probar cambio de día en la zona horaria configurada y filtros.
3. Verificar indicadores con un conjunto pequeño de datos cuyo resultado sea conocido.

Salida: registrar asistencia cambia los indicadores reales y la interfaz muestra errores de negocio entendibles.

## Fase 6 — Integración final, calidad y entrega

Ramas: `feat/frontend-fase-6` y `feat/backend-fase-6`.

### Anthony

**C22 · `fix(frontend): completar responsive accesibilidad y estados`**

1. Revisar todas las pantallas a 360, 768 y 1280 px de ancho.
2. Corregir navegación, tablas, formularios y modales sin desbordes que impidan su uso.
3. Revisar ambos temas, foco, etiquetas, contraste y mensajes.
4. Simular API desconectada, listas vacías y sesión vencida; corregir los problemas encontrados.
5. Ejecutar el build de producción del frontend y resolver errores.

**C23 · `docs(frontend): documentar uso y agregar evidencias visuales`**

1. Agregar instrucciones frontend al README y capturas de las ocho pantallas en docs/evidencias.
2. Incluir capturas de móvil, tema oscuro y estados de interfaz con datos ficticios.
3. Vincular el prototipo y preparar el recorrido de demostración descrito abajo.

### Compañero

**C24 · `fix(backend): cerrar incidencias de integracion y configuracion`**

1. Ejecutar todas las pruebas y corregir incidencias encontradas por ambos.
2. Revisar errores, CORS, variables obligatorias y arranque desde base vacía.
3. Comprobar que los endpoints privados verifican JWT y no filtran secretos.
4. Si no existen defectos, usar un mensaje honesto como `chore(backend): verificar configuracion de entrega` y guardar resultados de verificación; no inventar una corrección.

**C25 · `docs(backend): completar instalacion API y evidencias de colaboracion`**

1. Completar README con versión de Node, instalación, variables, migraciones, seed, ejecución y pruebas.
2. Verificar docs/API.md contra la implementación final.
3. Registrar enlaces a pull requests y evidencia del historial de ambos en docs/evidencias.
4. Coordinar este cambio después de integrar C23 para evitar conflictos de README.

Salida: cada integrante clona main en una carpeta nueva y consigue ejecutar el proyecto siguiendo únicamente el README. Se verifican los 15 requisitos.

## Rutas de interfaz y API que deben acordarse

Frontend: `/login`, `/dashboard`, `/socios`, `/socios/nuevo`, `/socios/:id`, `/socios/:id/editar`, `/planes`, `/asistencias`.

| Método | Ruta bajo /api | Propósito |
|---|---|---|
| GET | /health | Estado del servicio, público |
| POST | /auth/login | Login, público |
| GET | /auth/me | Usuario autenticado |
| GET | /dashboard | Indicadores |
| GET, POST | /socios | Listar/buscar y crear |
| GET, PATCH, DELETE | /socios/:id | Detalle, editar y eliminar |
| GET, POST | /planes | Listar y crear |
| PATCH, DELETE | /planes/:id | Editar/desactivar y eliminar si no tiene referencias |
| GET, POST | /socios/:id/membresias | Historial y asignación |
| GET, POST | /asistencias | Consulta y registro |

Usar `{ "data": ... }` para respuestas con contenido y `{ "error": { "code": "...", "message": "...", "fields": {} } }` para errores. Definir en C05 el detalle de cada campo, filtros y ejemplos; esta tabla no sustituye ese contrato.

## Flujo Git en cada fase

Ejemplo para Anthony en fase 1; el compañero cambia frontend por backend:

```bash
git switch main
git pull origin main
git switch -c feat/frontend-fase-1
# Realizar y verificar el trabajo de C02.
git add docs/ux/
git commit -m "docs(frontend): agregar prototipo UX UI de GymControl"
# Realizar y verificar el trabajo de C03.
git add frontend/
git commit -m "feat(frontend): inicializar React y rutas principales"
git push -u origin feat/frontend-fase-1
```

Abrir el pull request en GitHub, solicitar revisión e integrar después de aprobar los criterios. Si hay conflictos, resolverlos con el compañero y probar antes de completar el merge. No usar force push sobre main. Los comandos `git add` deben adaptarse a los archivos realmente modificados y revisarse con `git diff --staged` antes del commit.

## Demostración final y requisitos

Recorrido: login → crear plan → registrar socio → asignar membresía → registrar asistencia → consultar dashboard → editar socio → eliminar un socio de prueba → activar tema oscuro y recargar → mostrar versión móvil.

| Requisito de la entrega | Evidencia / fase |
|---|---|
| 1. Repositorio actualizado | main integrado y accesible; todas las fases |
| 2. React ejecutándose | Instalación y arranque desde clon nuevo; fase 6 |
| 3. Diseño basado en prototipo | docs/ux y comparación con pantallas; fases 1 y 6 |
| 4. Componentes reutilizables | components usado por varias páginas; fase 2 |
| 5. Mínimo cinco pantallas | Ocho rutas, siete además del login; fases 1–5 |
| 6. Routing | Navegación, detalle por id y rutas protegidas; fases 1–2 |
| 7. Backend real | Operaciones HTTP y persistencia al reiniciar; fases 2–5 |
| 8. CRUD desde interfaz | Crear, consultar, editar y eliminar socio; fase 3 |
| 9. Login y JWT | Login real y rechazo de acceso sin token; fase 2 |
| 10. Validaciones | Cliente y servidor, datos inválidos y conflictos; fases 2–5 |
| 11. Dark Mode persistente | Cambiar tema y recargar; fases 2 y 6 |
| 12. Responsive | Evidencias móvil/tablet/escritorio; fase 6 |
| 13. Loading, Empty, Error, Success | Casos visibles y comprobados; fases 2–6 |
| 14. README | Instalación, configuración y ejecución reproducibles; fase 6 |
| 15. Commits de todos | Historial real y PR de ambos; todas las fases |

Para consultar contribuciones al terminar:

```bash
git shortlog -sne --all
git log --all --format="%h | %an | %s"
```

Guardar evidencia sin tokens, correos privados innecesarios ni información personal de socios reales. No marcar una fase completa únicamente porque exista su commit: verificar su resultado.
