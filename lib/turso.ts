import { createClient } from '@libsql/client';

const getTursoConfig = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    return null;
  }

  return { url, authToken };
};

export const hasTurso = () => Boolean(getTursoConfig());

export const getTursoClient = () => {
  const config = getTursoConfig();

  if (!config) {
    return null;
  }

  return createClient(config);
};

export const ensureSchema = async () => {
  const db = getTursoClient();

  if (!db) {
    return null;
  }

  await db.batch([
    `CREATE TABLE IF NOT EXISTS cms_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS estimate_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service_type TEXT,
      vehicle TEXT,
      zip TEXT,
      damage_notes TEXT,
      appointment_date TEXT,
      appointment_window TEXT,
      service_address TEXT,
      contact_preference TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS estimate_images (
      id TEXT PRIMARY KEY,
      estimate_id TEXT NOT NULL,
      url TEXT NOT NULL,
      original_name TEXT,
      size_bytes INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (estimate_id) REFERENCES estimate_requests(id)
    )`,
  ], 'write');

  return db;
};
