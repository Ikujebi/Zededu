import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // decoded will include school_id if you put it in the token
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};

// ✅ Added school_id here
export interface AuthRequest extends Request {
  user?: { 
    id: string; 
    role?: string; 
    email?: string; 
    school_id?: number; // or string, match your DB type
  };
}
