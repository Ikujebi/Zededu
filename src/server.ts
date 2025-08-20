import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import schoolRoutes from "./routes/schoolRoutes";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import parentRoutes from "./routes/parentRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/authRoutes";
import classRoutes from "./routes/classRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import feesRoutes from "./routes/feesRoutes";
import adminRoutes from "./routes/adminRoutes";
import examRoutes from "./routes/examRoutes";
import receiptRoutes from "./routes/receiptRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import videoRoutes from "./routes/videoRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/schools", schoolRoutes);
app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/parents", parentRoutes);
app.use("/payments", paymentRoutes);
app.use("/auth", authRoutes);
app.use("/classes", classRoutes);
app.use("/subjects", subjectRoutes);
app.use("/fees", feesRoutes);
app.use("/receipt", receiptRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/exam", examRoutes);
app.use("/video", videoRoutes);

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
