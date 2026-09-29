import { Router } from "express";
import * as auth from "../controllers/auth.ts" ;

const router = Router() ;

//AUTH
router.post('/auth/signup' , auth.signup) ;
router.post('/auth/login' , auth.login) ;


export default router ;