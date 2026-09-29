import { Router } from "express";
import * as auth from "../controllers/auth.ts";
import * as s from "../validators/schemas.ts";
import { authenticate, validate } from "../middleware/index.ts";

const router = Router();

//AUTH
router.post("/auth/signup", validate(s.signupSchema), auth.signup);
router.post("/auth/login", validate(s.loginSchema), auth.login);
router.get("/auth/me", authenticate, auth.me);
router.post(
  "/auth/password",
  authenticate,
  validate(s.changePasswordSchema),
  auth.changePassword,
);

export default router;
