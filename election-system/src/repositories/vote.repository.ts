import pool from '../config/db';
import { Vote, VoteWithCandidate } from '../types/models';

export class VoteRepository {
  async findByUserId(userId: string): Promise<VoteWithCandidate | null> {
    const result = await pool.query(
      `SELECT v.*, 
              c.title as candidate_title, c.first_name as candidate_first_name, 
              c.last_name as candidate_last_name, c.number as candidate_number,
              p.id as party_id, p.name as party_name, p.logo_url as party_logo_url
       FROM votes v
       JOIN candidates c ON v.candidate_id = c.id
       JOIN parties p ON c.party_id = p.id
       WHERE v.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async upsert(userId: string, candidateId: number): Promise<Vote> {
    const result = await pool.query(
      `INSERT INTO votes (user_id, candidate_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET candidate_id = $2, updated_at = NOW()
       RETURNING *`,
      [userId, candidateId]
    );
    return result.rows[0];
  }

  async delete(userId: string): Promise<void> {
    await pool.query(`DELETE FROM votes WHERE user_id = $1`, [userId]);
  }

  async countByCandidate(candidateId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int as count FROM votes WHERE candidate_id = $1`,
      [candidateId]
    );
    return result.rows[0].count;
  }
}
