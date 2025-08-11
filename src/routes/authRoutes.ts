import { Router } from "express";
import { registerUser, loginUser, resetPassword, logoutUser } from "../controllers/authController";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);

export default router;
