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
  const token = req.headers.authorization?.split(" ")[1];
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
