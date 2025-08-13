// routes/adminRoutes.ts
import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";
import { approveSchool } from "../controllers/schoolController";
import { approveUser,getAllUsers, deleteUser  } from "../controllers/userController";

const router = Router();

// Super Admin approves school
router.patch(
  "/schools/:schoolId/approve",
  authenticateUser,
  authorizeRoles("super_admin"),
  approveSchool
);

// School Admin approves user
router.patch(
  "/users/:userId/approve",
  authenticateUser,
  authorizeRoles("school_admin"),
  approveUser
);

router.get(
  "/users",
  authenticateUser,
  authorizeRoles("super_admin", "school_admin"),
  getAllUsers
);

// Delete a user
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeRoles("super_admin", "school_admin"),
  deleteUser
);

export default router;
