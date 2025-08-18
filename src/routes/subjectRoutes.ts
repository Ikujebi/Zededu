import { Router } from "express";
import { createSubject, getSubjects, updateSubject, deleteSubject } from "../controllers/subjectController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateUser, createSubject);
router.get("/", authenticateUser, getSubjects);
router.patch("/:id", authenticateUser, updateSubject);
router.delete("/:id", authenticateUser, deleteSubject);

export default router;
