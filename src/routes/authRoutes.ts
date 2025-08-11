import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  resetPassword, 
  logoutUser, 
  refreshAccessToken 
} from "../controllers/authController";
const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

export default router;
