import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: number;      // must match DB type
  role: string;
  email?: string;
  school_id?: number;
}
