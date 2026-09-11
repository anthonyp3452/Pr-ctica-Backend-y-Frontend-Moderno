-- GymControl schema v1
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS socios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL COLLATE NOCASE UNIQUE,
  telefono TEXT NOT NULL DEFAULT '',
  fecha_alta TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS planes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  precio_centavos INTEGER NOT NULL CHECK (precio_centavos >= 0),
  duracion_dias INTEGER NOT NULL CHECK (duracion_dias > 0),
  activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS membresias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  socio_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  plan_nombre TEXT NOT NULL,
  precio_centavos INTEGER NOT NULL CHECK (precio_centavos >= 0),
  duracion_dias INTEGER NOT NULL CHECK (duracion_dias > 0),
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES planes(id),
  CHECK (fecha_fin >= fecha_inicio)
);

CREATE INDEX IF NOT EXISTS idx_membresias_socio ON membresias(socio_id);
CREATE INDEX IF NOT EXISTS idx_membresias_fechas ON membresias(fecha_inicio, fecha_fin);

CREATE TABLE IF NOT EXISTS asistencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  socio_id INTEGER NOT NULL,
  registrado_en TEXT NOT NULL,
  dia_local TEXT NOT NULL,
  FOREIGN KEY (socio_id) REFERENCES socios(id) ON DELETE CASCADE,
  UNIQUE (socio_id, dia_local)
);

CREATE INDEX IF NOT EXISTS idx_asistencias_socio ON asistencias(socio_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_dia ON asistencias(dia_local);
