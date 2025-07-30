import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      user_id: string;
      // Add other fields if needed (like email, roles, etc.)
    }

    interface Request {
      token?: string;
      user?: User;
    }
  }
}
