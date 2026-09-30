import { Router } from "express";
import * as auth from "../controllers/auth.controller.ts";
import * as s from "../validators/schemas.ts";
import * as store from "../controllers/store.controller.ts";
import * as admin from "../controllers/admin.controller.ts";
import { authenticate, authorize, validate } from "../middleware/index.ts";

const router = Router();

//AUTH (_login for all users_)
router.post("/auth/signup", validate(s.signupSchema), auth.signup);
router.post("/auth/login", validate(s.loginSchema), auth.login);
router.get("/auth/me", authenticate, auth.me);
router.post(
  "/auth/password",
  authenticate,
  validate(s.changePasswordSchema),
  auth.changePassword,
);

//NORMAL USER
router.get("/stores", authenticate, authorize("USER"), store.listStores);
router.put(
  "/stores/:id/rating", authenticate, authorize("USER"), validate(s.ratingSchema),
  store.rateStore
);

// STORE OWNER
router.get('/owner/dashboard' , authenticate , authorize('OWNER'), store.ownerDashboard );


// Admin
const A = [authenticate, authorize('ADMIN')] as const;
router.get('/admin/dashboard', ...A, admin.dashboard);
router.post('/admin/users', ...A, validate(s.adminCreateUserSchema), admin.createUser);
router.post('/admin/stores', ...A, validate(s.adminCreateStoreSchema), admin.createStore);
router.get('/admin/users', ...A, admin.listUsers);
router.get('/admin/users/:id', ...A, admin.getUser);
router.get('/admin/stores', ...A, admin.listStores);




export default router;
