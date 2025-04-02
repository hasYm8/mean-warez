import express from 'express';
import { GetBooks } from '../controllers/book.controller.js';

const router = express.Router();

router.get("/", GetBooks);

export default router;