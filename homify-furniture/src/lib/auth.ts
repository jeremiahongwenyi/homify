import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing database connection string. Set DATABASE_URL.");
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
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      phone_number: {
        type: "string",
        input: true,
        required: true,
      },
    },
  },

});

type Session = typeof auth.$Infer.Session;
