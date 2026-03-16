import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString =
  process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set NEON_DATABASE_URL or DATABASE_URL.",
  );
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields:{
      role: {
        type:"string",
        input:false
      }

    }
  },
  
});

type Session = typeof auth.$Infer.Session
