import pool from "./db";

const createTables = async () => {
  try {
    // Create schools table with approval status
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        email VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create users table with approval status and auth-related fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'teacher', 'student', 'parent')),
        school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,

        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

        -- Auth-related fields
        email_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        last_login TIMESTAMP,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create classes table
    await pool.query(`
  CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g. "Primary 1", "Grade 10"
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    // Create subjects table
    await pool.query(`
  CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g. "Mathematics"
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    // Create class_subjects table (many-to-many)
    await pool.query(`
  CREATE TABLE IF NOT EXISTS class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE(class_id, subject_id)
  );
`);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date) -- Prevent duplicate attendance for the same day
  );
`);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    // Create submissions table
    await pool.query(`
  CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded BOOLEAN DEFAULT false,
    grade VARCHAR(20),
    UNIQUE(assignment_id, student_id) -- One submission per student per assignment
  );
`);

    // FEES TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id SERIAL PRIMARY KEY,
        school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        class_id INT REFERENCES classes(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC(12, 2) NOT NULL,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // PAYMENTS TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fee_id INT REFERENCES fees(id) ON DELETE SET NULL,
        amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
        method VARCHAR(50),
        reference VARCHAR(255) UNIQUE,
        receipt_url TEXT,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // INVOICES TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // INVOICE ITEMS TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
        fee_id INT REFERENCES fees(id) ON DELETE SET NULL,
        description VARCHAR(255),
        amount NUMERIC(12, 2) NOT NULL
      );
    `);
    // =========================
    // RECIEPT ITEMS TABLE
    // =========================
    await pool.query(`
    CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,   -- sequential receipt number
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_id INT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),                   -- cash, transfer, card
    issued_at TIMESTAMP DEFAULT NOW(),            -- when receipt was generated
    created_by INT REFERENCES users(id),          -- staff who issued it
    notes TEXT                                    -- optional remarks
);


    `);

     // =========================
    // EXAMS TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        class_id INT REFERENCES classes(id) ON DELETE CASCADE,
        subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        exam_date DATE NOT NULL,
        created_by INT REFERENCES users(id) ON DELETE SET NULL, -- teacher/admin who created
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // EXAM RESULTS TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id SERIAL PRIMARY KEY,
        exam_id INT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
        student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        score NUMERIC(5,2) NOT NULL,
        grade VARCHAR(10),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(exam_id, student_id) -- prevent duplicate results
      );
    `);
    // =========================
    // VIDEO CLASSES TABLE
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_classes (
        id SERIAL PRIMARY KEY,
        school_id INT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        class_id INT REFERENCES classes(id) ON DELETE CASCADE,
        created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- teacher/admin who scheduled
        title VARCHAR(255) NOT NULL,
        description TEXT,
        provider VARCHAR(50) NOT NULL CHECK (provider IN ('zoom','google_meet','jitsi','other')),
        meeting_url TEXT NOT NULL, -- actual join link
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled','ongoing','completed','cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // VIDEO CLASS PARTICIPANTS TABLE (optional, for tracking attendance)
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_class_participants (
        id SERIAL PRIMARY KEY,
        video_class_id INT NOT NULL REFERENCES video_classes(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('teacher','student','parent')),
        join_link TEXT, -- personalized join link if provider supports
        joined_at TIMESTAMP,
        left_at TIMESTAMP,
        UNIQUE(video_class_id, user_id) -- one participation per user per class
      );
    `);

      await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- who receives it
        sender_id INT REFERENCES users(id) ON DELETE SET NULL, -- who triggered it
        type VARCHAR(50) NOT NULL, -- e.g. "exam", "assignment", "payment", "system"
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // MESSAGES TABLE (direct chat)
    // =========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
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
