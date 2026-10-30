import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com") ? { rejectUnauthorized: false } : false
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(30) NOT NULL,
      content TEXT NOT NULL,
      scheduled_at TIMESTAMP NOT NULL,
      status VARCHAR(30) DEFAULT 'Scheduled',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(30) NOT NULL,
      month VARCHAR(20) NOT NULL,
      followers INTEGER NOT NULL,
      reach INTEGER NOT NULL,
      engagement NUMERIC(5,2) NOT NULL
    );
  `);
}
