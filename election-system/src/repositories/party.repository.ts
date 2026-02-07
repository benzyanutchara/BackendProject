import pool from '../config/db';
import { Party, PartyWithCandidates } from '../types/models';

export class PartyRepository {
  async findById(id: number): Promise<Party | null> {
    const result = await pool.query(`SELECT * FROM parties WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findByName(name: string): Promise<Party | null> {
    const result = await pool.query(`SELECT * FROM parties WHERE name = $1`, [name]);
    return result.rows[0] || null;
  }

  async create(data: { name: string; policy: string; logoUrl: string }): Promise<Party> {
    const result = await pool.query(
      `INSERT INTO parties (name, policy, logo_url) VALUES ($1, $2, $3) RETURNING *`,
      [data.name, data.policy, data.logoUrl]
    );
    return result.rows[0];
  }

  async list(): Promise<Party[]> {
    const result = await pool.query(`SELECT * FROM parties ORDER BY name ASC`);
    return result.rows;
  }

  async listBasic(): Promise<{ id: number; name: string; logo_url: string }[]> {
    const result = await pool.query(`SELECT id, name, logo_url FROM parties ORDER BY name ASC`);
    return result.rows;
  }

  async findByIdWithCandidates(id: number): Promise<PartyWithCandidates | null> {
    const partyResult = await pool.query(`SELECT * FROM parties WHERE id = $1`, [id]);
    if (!partyResult.rows[0]) return null;

    const candidatesResult = await pool.query(
      `SELECT c.*, con.province, con.district_number, con.is_closed
       FROM candidates c
       JOIN constituencies con ON c.constituency_id = con.id
       WHERE c.party_id = $1
       ORDER BY con.province, con.district_number`,
      [id]
    );

    return {
      ...partyResult.rows[0],
      candidates: candidatesResult.rows,
    };
  }
}
