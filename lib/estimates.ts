import crypto from 'crypto';
import { ensureSchema } from './turso';

export type EstimateStatus = 'new' | 'reviewing' | 'scheduled' | 'completed' | 'archived';

export type EstimateRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  vehicle: string;
  zip: string;
  damageNotes: string;
  appointmentDate: string;
  appointmentWindow: string;
  serviceAddress: string;
  contactPreference: string;
  status: EstimateStatus;
  createdAt: string;
  images: string[];
};

const getField = (formData: FormData, key: string, maxLength = 500) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
};

export const createEstimateFromForm = async (formData: FormData, imageUrls: string[]) => {
  const db = await ensureSchema();

  if (!db) {
    throw new Error('Turso is required to save estimate requests.');
  }

  const id = crypto.randomUUID();
  const name = getField(formData, 'name', 120);
  const phone = getField(formData, 'phone', 80);

  if (!name || !phone) {
    throw new Error('Name and phone are required.');
  }

  await db.batch([
    {
      sql: `INSERT INTO estimate_requests (
        id, name, phone, email, service_type, vehicle, zip, damage_notes,
        appointment_date, appointment_window, service_address, contact_preference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        name,
        phone,
        getField(formData, 'email', 160),
        getField(formData, 'serviceType', 120),
        getField(formData, 'vehicle', 160),
        getField(formData, 'zip', 30),
        getField(formData, 'damage', 1200),
        getField(formData, 'appointmentDate', 40),
        getField(formData, 'appointmentWindow', 80),
        getField(formData, 'serviceAddress', 220),
        getField(formData, 'contactPreference', 40) || 'text',
      ],
    },
    ...imageUrls.map((url) => ({
      sql: 'INSERT INTO estimate_images (id, estimate_id, url) VALUES (?, ?, ?)',
      args: [crypto.randomUUID(), id, url],
    })),
  ], 'write');

  return id;
};

export const listEstimates = async (): Promise<EstimateRequest[]> => {
  const db = await ensureSchema();

  if (!db) {
    return [];
  }

  const result = await db.execute(`
    SELECT
      r.id,
      r.name,
      r.phone,
      r.email,
      r.service_type,
      r.vehicle,
      r.zip,
      r.damage_notes,
      r.appointment_date,
      r.appointment_window,
      r.service_address,
      r.contact_preference,
      r.status,
      r.created_at,
      COALESCE(json_group_array(i.url) FILTER (WHERE i.url IS NOT NULL), '[]') AS images
    FROM estimate_requests r
    LEFT JOIN estimate_images i ON i.estimate_id = r.id
    GROUP BY r.id
    ORDER BY r.created_at DESC
    LIMIT 100
  `);

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name || ''),
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    serviceType: String(row.service_type || ''),
    vehicle: String(row.vehicle || ''),
    zip: String(row.zip || ''),
    damageNotes: String(row.damage_notes || ''),
    appointmentDate: String(row.appointment_date || ''),
    appointmentWindow: String(row.appointment_window || ''),
    serviceAddress: String(row.service_address || ''),
    contactPreference: String(row.contact_preference || ''),
    status: String(row.status || 'new') as EstimateStatus,
    createdAt: String(row.created_at || ''),
    images: JSON.parse(String(row.images || '[]')) as string[],
  }));
};

export const updateEstimateStatus = async (id: string, status: EstimateStatus) => {
  const db = await ensureSchema();

  if (!db) {
    throw new Error('Turso is required to update estimate requests.');
  }

  await db.execute({
    sql: 'UPDATE estimate_requests SET status = ? WHERE id = ?',
    args: [status, id],
  });
};
