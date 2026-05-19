import { Router } from "express";
import {
  companyRegister,
  login,
  userRegister
} from "../controllers/auth.controller"

const router = Router();

// POST /auth/register/user
router.post( "/register/user", userRegister );


// POST /auth/register/company
router.post( "/register/company", companyRegister);


//POST /auth/login
router.post( "/login", login);

export default router;
