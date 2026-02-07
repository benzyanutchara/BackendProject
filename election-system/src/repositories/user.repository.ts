import pool from '../config/db';
import { User, UserWithConstituency } from '../types/models';

export class UserRepository {
  async findByNationalId(nationalId: string): Promise<UserWithConstituency | null> {
    const result = await pool.query(
      `SELECT u.*, c.province, c.district_number, c.is_closed
       FROM users u
       JOIN constituencies c ON u.constituency_id = c.id
       WHERE u.national_id = $1`,
      [nationalId]
    );
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<UserWithConstituency | null> {
    const result = await pool.query(
      `SELECT u.*, c.province, c.district_number, c.is_closed
       FROM users u
       JOIN constituencies c ON u.constituency_id = c.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: {
    nationalId: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    address: string;
    constituencyId: number;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (national_id, password, title, first_name, last_name, address, constituency_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.nationalId, data.password, data.title, data.firstName, data.lastName, data.address, data.constituencyId]
    );
    return result.rows[0];
  }

  async updateRole(nationalId: string, role: 'VOTER' | 'EC'): Promise<User> {
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE national_id = $2 RETURNING *`,
      [role, nationalId]
    );
    return result.rows[0];
  }

  async searchByNationalId(searchTerm: string): Promise<UserWithConstituency[]> {
    const result = await pool.query(
      `SELECT u.*, c.province, c.district_number, c.is_closed
       FROM users u
       JOIN constituencies c ON u.constituency_id = c.id
       WHERE u.national_id LIKE $1
       ORDER BY u.created_at DESC`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  async list(): Promise<UserWithConstituency[]> {
    const result = await pool.query(
      `SELECT u.*, c.province, c.district_number, c.is_closed
       FROM users u
       JOIN constituencies c ON u.constituency_id = c.id
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  }
}
