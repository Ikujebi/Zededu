import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import schoolRoutes from "./routes/schoolRoutes";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import parentRoutes from "./routes/parentRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/schools", schoolRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/parents", parentRoutes);
app.use("/payments", paymentRoutes);

app.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`PostgreSQL time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error connecting to DB");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
