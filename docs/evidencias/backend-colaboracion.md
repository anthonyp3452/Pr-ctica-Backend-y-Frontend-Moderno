# Evidencia de colaboración — backend

**Desarrollador:** Diego Merida (`dmeridae@miumg.edu.gt`)

## Ramas publicadas en GitHub

| Rama | Contenido |
| --- | --- |
| `feat/backend-fase-1` | Express + health + esquema SQLite + `docs/API.md` |
| `feat/backend-fase-2` | Login JWT + tests de autenticación |
| `feat/backend-fase-3` | CRUD socios + tests |
| `feat/backend-fase-4` | Planes, membresías + tests |
| `feat/backend-fase-5` | Asistencias, dashboard + tests |
| `feat/backend-fase-6` | Verificación de entrega + documentación |

Crear pull requests desde:

- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-1
- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-2
- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-3
- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-4
- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-5
- https://github.com/anthonyp3452/Pr-ctica-Backend-y-Frontend-Moderno/pull/new/feat/backend-fase-6

Tras la revisión del compañero, integrar con merge normal (sin squash) para conservar la autoría de cada commit.

## Commits backend (mensaje → fase)

1. `feat(backend): inicializar Express y configuracion del servidor`
2. `feat(backend): definir esquema SQLite y contrato API`
3. `feat(backend): implementar login y verificacion JWT`
4. `test(backend): verificar autenticacion y errores de acceso`
5. `feat(backend): implementar CRUD de socios`
6. `test(backend): cubrir CRUD y persistencia de socios`
7. `feat(backend): implementar planes y asignacion de membresias`
8. `test(backend): verificar vigencia y reglas de membresias`
9. `feat(backend): implementar asistencias e indicadores`
10. `test(backend): cubrir asistencias y calculos del dashboard`
11. `chore(backend): verificar configuracion de entrega`
12. `docs(backend): completar instalacion API y evidencias de colaboracion`

Consultar historial:

```bash
git log --all --format="%h | %an | %s" -- backend docs/API.md docs/evidencias README.md
git shortlog -sne --all
```
