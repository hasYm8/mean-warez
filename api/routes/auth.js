import express from 'express';
import { login, register, status, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/status", status);

router.get("/logout", logout);

export default router;