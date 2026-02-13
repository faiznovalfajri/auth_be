import { Router } from "express";
import { allAccount, getDashboard, login, register } from "../controller/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const router = Router();

router.post("/register", register)
router.post("/login", login)

// untuk melakukan verifikasi token 
router.get("/dashboard", verifyToken, getDashboard)

// untuk mendapatkan semua akun
router.get("/allAccount", allAccount)