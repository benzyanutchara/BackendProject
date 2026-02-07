import pool from '../config/db';
import { Admin } from '../types/models';

export class AdminRepository {
  async findByUsername(username: string): Promise<Admin | null> {
    const result = await pool.query(
      `SELECT * FROM admins WHERE username = $1`,
      [username]
    );
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<Admin | null> {
    const result = await pool.query(
      `SELECT * FROM admins WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(username: string, password: string): Promise<Admin> {
    const result = await pool.query(
      `INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *`,
      [username, password]
    );
    return result.rows[0];
  }
}
