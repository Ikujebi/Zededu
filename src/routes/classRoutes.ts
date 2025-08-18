import { Router } from "express";
import { createClass, getClasses, getClassById, updateClass, deleteClass } from "../controllers/classController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateUser, createClass);
router.get("/", authenticateUser, getClasses);
router.get("/:id", authenticateUser, getClassById);
router.patch("/:id", authenticateUser, updateClass);
router.delete("/:id", authenticateUser, deleteClass);

export default router;
