import pool from "./db";

const createTables = async () => {
  try {
    // Create schools table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'teacher', 'student', 'parent')),
        school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables created successfully");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    await pool.end(); // Ensure connection closes
  }
};

createTables();
