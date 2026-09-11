# Seguimiento del frontend

Responsable: Anthony. Rama: `feat/frontend-fase-1`.

## Fase 1

- C02: prototipo con ocho pantallas de escritorio, login/dashboard/socios en móvil, variantes oscuras y galería local. Mensaje: `docs(frontend): agregar prototipo UX UI de GymControl`.
- C03: React con Vite, React Router, layout, ocho pantallas y 404; estilos de referencia, menú móvil, datos ficticios separados y documentación de ejecución.

### Correspondencia entre diseño y código

| Prototipo | Ruta | Componente en frontend/src/pages |
|---|---|---|
| login.svg | /login | Login.jsx |
| dashboard.svg | /dashboard | Dashboard.jsx |
| socios.svg | /socios | Members.jsx |
| detalle.svg | /socios/1 | MemberDetail.jsx |
| alta.svg | /socios/nuevo | MemberForm.jsx |
| edicion.svg | /socios/1/editar | MemberForm.jsx |
| planes.svg | /planes | Plans.jsx |
| asistencias.svg | /asistencias | Attendance.jsx |

Se refina la composición del prototipo con iconos Lucide, tipografía DM Sans (fallback de sistema) y tarjetas adaptables. Los números de ejemplo del código corresponden a su conjunto pequeño de fixtures; no representan datos reales del gimnasio.

### Revisar antes de integrar

1. Seguir el README para arrancar React.
2. Entrar en `/dashboard` y abrir cada enlace del menú.
3. Buscar `valeria` o `lopez` en socios; abrir el detalle y después editar. Regresar con Cancelar.
4. Visitar `/socios/nuevo` y comprobar que Guardar está deshabilitado con explicación.
5. En asistencias, filtrar por 2026-09-09 y después por una fecha sin fixtures.
6. Entrar en `/login`: formulario de acceso deshabilitado y enlace explícito a la vista de ejemplo.
7. Abrir `/socios/999` y una ruta inexistente; comprobar sus mensajes y enlaces de regreso.
8. Revisar menú móvil y funcionamiento con teclado. No confundir adaptación implementada con auditoría completa: la revisión final responsive y accesibilidad corresponde a C22.
9. Ejecutar `npm run build`.

### Dependencias para continuar

Verificación realizada para C03: build de producción correcto; renderizado de las ocho páginas y tres casos de ruta/id inexistente comprobado mediante React en servidor; referencias de fixtures coherentes; vista local responde HTTP 200. No se realizó una auditoría visual automatizada ni una prueba de backend, que todavía no está implementado.

- C06 se puede comenzar tras revisar la fase 1: ampliar componentes, temas y persistencia.
- C07 requiere el contrato de login y C08 del backend. Esperar endpoint, nombres de campos, expiración JWT y formato de errores.
- El frontend no implementa todavía el trabajo backend C04/C05. La fase conjunta no está finalizada hasta que el compañero aporte esas tareas y revisen el contrato.

No mezclar este PR automáticamente: el compañero debe revisar el diseño y los archivos del frontend conforme al flujo acordado.
