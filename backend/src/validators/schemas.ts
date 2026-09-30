import { z } from "zod";

const name = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(60, "Name must be at most 60 characters");

const email = z.string().trim().email("Invalid Email");

const address = z
  .string()
  .trim()
  .min(1, "address is required")
  .max(400, "address must be at most 400 characters");

const password = z
  .string()
  .min(8, "Password must be at least 8 character long")
  .max(16, "Password must be at most 16 character long")
  .regex(/[A-Z]/, "Password needs at least one Uppercase character")
  .regex(/[^A-Za-z0-9]/, "password needs at least one special character");

export const signupSchema = z.object({ name, email, address, password });
export const loginSchema = z.object({ email, password: z.string().min(1) });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: password,
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});


export const adminCreateUserSchema = z.object({
  name,
  email,
  address,
  password,
  role: z.enum(['ADMIN', 'USER', 'OWNER']),
});
export const adminCreateStoreSchema = z.object({
  name,
  email,
  address,
  ownerId: z.number().int().positive().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type AdminCreateStoreInput = z.infer<typeof adminCreateStoreSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
