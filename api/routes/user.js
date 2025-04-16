import express from 'express'
import { getAllUsers, getById } from '../controllers/user.controller.js';
import { verifyAdmin } from '../utils/auth.js';

const router = express.Router();

// Get all
router.get('/', verifyAdmin, getAllUsers);

// Get by id
router.get('/:id', getById);

export default router;