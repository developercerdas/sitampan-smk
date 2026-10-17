import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool Configuration
// Mendukung local PostgreSQL, Supabase, Neon, ataupun Railway via DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sitampan_smk';

export const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Error] Unexpected error on idle client:', err);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('[PostgreSQL Query]', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[PostgreSQL Query Error]', { text, error: error.message });
    throw error;
  }
};
