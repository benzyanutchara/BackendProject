import pool from '../config/db';
import { Constituency, CandidateWithPartyAndVotes } from '../types/models';

export class ConstituencyRepository {
  async findById(id: number): Promise<Constituency | null> {
    const result = await pool.query(
      `SELECT * FROM constituencies WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByProvinceAndDistrict(province: string, districtNumber: number): Promise<Constituency | null> {
    const result = await pool.query(
      `SELECT * FROM constituencies WHERE province = $1 AND district_number = $2`,
      [province, districtNumber]
    );
    return result.rows[0] || null;
  }

  async create(province: string, districtNumber: number): Promise<Constituency> {
    const result = await pool.query(
      `INSERT INTO constituencies (province, district_number)
       VALUES ($1, $2) RETURNING *`,
      [province, districtNumber]
    );
    return result.rows[0];
  }

  async list(): Promise<Constituency[]> {
    const result = await pool.query(
      `SELECT * FROM constituencies ORDER BY province ASC, district_number ASC`
    );
    return result.rows;
  }

  async updateClosedStatus(id: number, isClosed: boolean): Promise<Constituency> {
    const result = await pool.query(
      `UPDATE constituencies SET is_closed = $1 WHERE id = $2 RETURNING *`,
      [isClosed, id]
    );
    return result.rows[0];
  }

  async getCandidatesWithVotes(constituencyId: number, includeCounts: boolean): Promise<CandidateWithPartyAndVotes[]> {
    let query: string;
    
    if (includeCounts) {
      query = `
        SELECT c.*, p.name as party_name, p.logo_url as party_logo_url,
               COUNT(v.id)::int as vote_count
        FROM candidates c
        JOIN parties p ON c.party_id = p.id
        LEFT JOIN votes v ON c.id = v.candidate_id
        WHERE c.constituency_id = $1
        GROUP BY c.id, p.name, p.logo_url
        ORDER BY c.number ASC
      `;
    } else {
      query = `
        SELECT c.*, p.name as party_name, p.logo_url as party_logo_url,
               0 as vote_count
        FROM candidates c
        JOIN parties p ON c.party_id = p.id
        WHERE c.constituency_id = $1
        ORDER BY c.number ASC
      `;
    }
    
    const result = await pool.query(query, [constituencyId]);
    return result.rows;
  }

  async getClosedConstituencies(): Promise<any[]> {
    const result = await pool.query(`
      SELECT con.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', c.id,
                   'title', c.title,
                   'first_name', c.first_name,
                   'last_name', c.last_name,
                   'number', c.number,
                   'party_id', c.party_id,
                   'party_name', p.name,
                   'party_logo_url', p.logo_url,
                   'vote_count', COALESCE(vc.count, 0)
                 )
               ) FILTER (WHERE c.id IS NOT NULL),
               '[]'
             ) as candidates
      FROM constituencies con
      LEFT JOIN candidates c ON con.id = c.constituency_id
      LEFT JOIN parties p ON c.party_id = p.id
      LEFT JOIN (
        SELECT candidate_id, COUNT(*)::int as count
        FROM votes
        GROUP BY candidate_id
      ) vc ON c.id = vc.candidate_id
      WHERE con.is_closed = true
      GROUP BY con.id
    `);
    return result.rows;
  }
}
