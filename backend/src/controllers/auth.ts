import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { users, type User } from "../db/schema";
import { eq } from "drizzle-orm";
import type { PublicUser } from "../types";

const sign = (u: Pick<User, "id" | "role">): string =>
  jwt.sign(
    { id: u.id, role: u.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } as jwt.SignOptions,
  );

const publicUser = (u: User): PublicUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  address: u.address,
  role: u.role,
});

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, address, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await db
      .insert(users)
      .values({ name, email, address, passwordHash, role: "USER" })
      .returning({ id: users.id });

    res.status(201).json({ id: created.id });
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(publicUser(user));
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash)))
      return res.status(400).json({ messgae: "current password is incorrect" });

    await db
      .update(users)
      .set({ passwordHash: await bcrypt.hash(newPassword, 10) })
      .where(eq(users.id, user.id));

    res.json({ message: "password updated successfully!" });
  } catch (e) {
    next(e);
  }
};
