import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env";

type User = {
  id: number;
  token: string;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }
    try {
      const verify = jwt.verify(token, JWT_SECRET);
      req.user = verify as User;
      next();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token expired",
          });
        }
      }
      throw new Error("Invalid Signature");
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(401).json({
        message: err.message,
      });
    }
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
