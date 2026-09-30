import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload, Role } from "../types/index.ts";
import type { ZodSchema } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/db.ts";
import { users } from "../db/schema.ts";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let payload: JWTPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or Expired token, Login again!" });
  }

  try {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.id));
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    req.user = { ...payload, role: user.role };
    next();
  } catch (e) {
    next(e);
  }
};
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: result.error.issues.map((i) => ({
          field: i.path.join(","),
          message: i.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.user && roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ message: "forbidden" });
  };

export const notFound = (req: Request, res: Response) =>
  res.status(404).json({ message: "Route not found" });

interface PgError extends Error {
  code?: string;
  constraint?: string; // ← new: pg gives us the violated constraint's name
  status?: number;
}

const UNIQUE_VIOLATION_MESSAGES: Record<string, string> = {
  users_email_unique: "Email already exists",
  stores_email_unique: "Email already exists",
  stores_owner_id_unique: "This user already owns a store",
  ratings_user_id_store_id_unique: "You have already rated this store",
};

export const errorHandler = (
  err: PgError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === "23505") {
    const message =
      UNIQUE_VIOLATION_MESSAGES[err.constraint ?? ""] ??
      "This value is already in use";
    return res.status(409).json({ message });
  }
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
};
