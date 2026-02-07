import pool from '../config/db';
import { Candidate, CandidateWithConstituency, CandidateWithParty } from '../types/models';

export class CandidateRepository {
  async findById(id: number): Promise<Candidate | null> {
    const result = await pool.query(`SELECT * FROM candidates WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findByIdWithConstituency(id: number): Promise<CandidateWithConstituency | null> {
    const result = await pool.query(
      `SELECT c.*, con.province, con.district_number, con.is_closed
       FROM candidates c
       JOIN constituencies con ON c.constituency_id = con.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByNumberInConstituency(constituencyId: number, number: number): Promise<Candidate | null> {
    const result = await pool.query(
      `SELECT * FROM candidates WHERE constituency_id = $1 AND number = $2`,
      [constituencyId, number]
    );
    return result.rows[0] || null;
  }

  async create(data: {
    title: string;
    firstName: string;
    lastName: string;
    number: number;
    imageUrl: string;
    partyId: number;
    constituencyId: number;
  }): Promise<Candidate> {
    const result = await pool.query(
      `INSERT INTO candidates (title, first_name, last_name, number, image_url, party_id, constituency_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.title, data.firstName, data.lastName, data.number, data.imageUrl, data.partyId, data.constituencyId]
    );
    return result.rows[0];
  }

  async findByConstituency(constituencyId: number): Promise<CandidateWithParty[]> {
    const result = await pool.query(
      `SELECT c.*, p.name as party_name, p.logo_url as party_logo_url
       FROM candidates c
       JOIN parties p ON c.party_id = p.id
       WHERE c.constituency_id = $1
       ORDER BY c.number ASC`,
      [constituencyId]
    );
    return result.rows;
  }
}
