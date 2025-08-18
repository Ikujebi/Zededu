import { Router } from "express";
import {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController";
import { authenticateUser,authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateUser, markAttendance); // POST /attendance
router.get("/attendance", authenticateUser, getAttendance);
router.get("/:id", authenticateUser, getAttendanceById);   // GET /attendance/:id
router.patch("/:id", authenticateUser, updateAttendance);  // PATCH /attendance/:id
router.delete(
  "/:id",
  authenticateUser,          // ensure user is logged in
  authorizeRoles("admin"), // ensure user has admin role
  deleteAttendance
);// DELETE /attendance/:id


export default router;
