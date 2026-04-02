// neon-db.js
import postgres from 'postgres';

// Create a Postgres client
// Make sure you have DATABASE_URL in your environment variables
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }, // set to true if you use a secure connection
});