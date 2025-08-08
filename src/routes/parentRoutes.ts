import express from "express";
import {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent
} from "../controllers/parentController";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

// Create parent - only admin or school authority can do this
router.post("/", authenticateUser, authorizeRoles("admin", "school_admin"), createParent);

// Get all parents - only admin or school authority can view all
router.get("/", authenticateUser, authorizeRoles("admin", "school_admin"), getParents);

// Get single parent - parent can see their own, admin/school_admin can see any
router.get("/:id", authenticateUser, authorizeRoles("admin", "school_admin", "parent"), getParentById);

// Update parent details - only admin, school authority, or the parent themselves
router.put("/:id", authenticateUser, authorizeRoles("admin", "school_admin", "parent"), updateParent);

// Delete parent - only admin or school authority
router.delete("/:id", authenticateUser, authorizeRoles("admin", "school_admin"), deleteParent);

export default router;
