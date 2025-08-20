// src/models/settingsModel.ts
import pool from "../db";

export class SettingsModel {
  static async getSettings(schoolId?: number) {
    const query = `
      SELECT key, value FROM settings 
      WHERE school_id = $1 OR school_id IS NULL
    `;
    const values = [schoolId || null];
    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async updateSetting(schoolId: number | null, key: string, value: string) {
    const query = `
      INSERT INTO settings (school_id, key, value, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (school_id, key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING *;
    `;
    const values = [schoolId, key, value];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
