
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "./authMiddleware";
import pool from "../db";

export const paymentAuth = (allowedStatuses: string[] = ["paid"]) => {
  return [
    authenticateUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user.id;

        const result = await pool.query<{ payment_status: string }>(
          "SELECT payment_status FROM users WHERE id = $1",
          [userId]
        );

        if (!result.rows.length) {
          return res.status(404).json({ message: "User not found" });
        }

        const status = result.rows[0].payment_status;

        if (!allowedStatuses.includes(status)) {
          return res
            .status(402)
            .json({ message: "Payment required or status not permitted" });
        }

        next();
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    }
  ];
};
