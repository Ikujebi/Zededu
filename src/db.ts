import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
   database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
   port: parseInt(process.env.PG_PORT || "5432"),
});

export default pool;