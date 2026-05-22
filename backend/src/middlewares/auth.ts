import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  accountId: number;
  role: "user" | "company";
  profileId: number;
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const requireRole = (...roles: Array<"user" | "company">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required role: ${roles.join(" or ")}`,
      });
      return;
    }

    next();
  };
};

export const requireOwner = (paramKey: string = "id") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const raw = req.params[paramKey];
    const resourceId = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    const requesterId = req.user?.profileId;

    if (resourceId !== requesterId) {
      res.status(403).json({ error: "You don't own this resource" });
      return;
    }

    next();
  };
};
