import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
} from "../controllers/authController";

const router = Router();
router.get("/profile", authenticateUser, getProfile);

router.post("/signup", registerUser);
router.get("/verify-email", verifyEmail); // token as query param
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);

export default router;
