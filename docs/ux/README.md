# Prototipo UX/UI — C02

Referencia visual para el frontend de GymControl. Abrir [la galería](index.html) descargada en un navegador o consultar las imágenes SVG directamente en GitHub. Los SVG son imágenes vectoriales exportadas, sin dependencias de Figma ni servicios externos.

## Dirección visual

Aplicación de recepción: navegación lateral verde bosque, fondo claro y superficies blancas. El verde identifica acciones principales y membresías vigentes. Jerarquía de títulos clara, contenido compacto y espacio suficiente para operar con teclado o pantalla táctil.

| Token | Claro | Oscuro |
|---|---|---|
| Fondo | #F4F6F5 | #111B20 |
| Superficie | #FFFFFF | #1B282E |
| Texto principal | #172E29 | #EDF5F1 |
| Texto secundario | #64756E | #ACBEB7 |
| Acción / acento | #176B48 | #8EE3B4 |
| Navegación | #142D26 | #142D26 |

Tipografía: pila de sistema (Segoe UI, Arial, sans-serif), cuerpo 16 px, etiquetas 14 px, títulos 28–38 px. Espaciado: múltiplos de 4/8 px. Radio: 8–16 px. Controles: mínimo 44 px de alto. El color se acompaña de texto para los estados.

## Pantallas

| Imagen | Ruta prevista | Propósito |
|---|---|---|
| [Login](login.svg) | /login | Acceso del personal; diseño de formulario, sin autenticación en fase 1 |
| [Dashboard](dashboard.svg) | /dashboard | Socios vigentes, membresías vencidas y entradas del día |
| [Socios](socios.svg) | /socios | Búsqueda y acceso a detalle o alta |
| [Detalle](detalle.svg) | /socios/1 | Datos personales, membresía e historial |
| [Alta](alta.svg) | /socios/nuevo | Formulario de registro |
| [Edición](edicion.svg) | /socios/1/editar | Formulario de actualización |
| [Planes](planes.svg) | /planes | Opciones de membresía |
| [Asistencias](asistencias.svg) | /asistencias | Entradas e historial |

## Adaptación móvil y tema oscuro

- Menos de 768 px: navegación compacta, tarjetas apiladas y formularios a una columna; tablas dentro de una región desplazable.
- [Login móvil](login-movil.svg), [dashboard móvil](dashboard-movil.svg), [socios móvil](socios-movil.svg).
- [Login móvil oscuro](login-movil-oscuro.svg), [dashboard móvil oscuro](dashboard-movil-oscuro.svg), [socios móvil oscuro](socios-movil-oscuro.svg), [dashboard oscuro](dashboard-oscuro.svg).
- La persistencia y el selector de tema se implementan en C06. Estos archivos especifican su aspecto.

## Flujos y estados previstos

Login → dashboard → socios → nuevo socio → detalle → editar. Desde detalle se asignará una membresía; desde asistencias se registrará entrada. Los formularios de escritura y acceso permanecen deshabilitados o indican su fase pendiente hasta conectar la API.

Loading: indicador con texto y controles pendientes deshabilitados. Empty: explicación y acción pertinente. Error: mensaje comprensible y reintento. Success: confirmación tras respuesta correcta del backend. Eliminación: confirmación con nombre del socio. Estos estados funcionales se desarrollan en fases posteriores; no se simulan operaciones exitosas.

## Criterios de revisión

- Ocho pantallas identificadas con rutas y propósito.
- Login, dashboard y socios tienen variantes de escritorio y móvil.
- Paleta, tipografía, espaciados, navegación y variantes oscuras documentados.
- Todos los nombres, importes e indicadores son ficticios para ilustrar la interfaz; no son evidencia de backend.
- El código React puede refinar la composición manteniendo esta jerarquía y estos tokens.
