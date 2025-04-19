import express from 'express'
import { getAll, getById, deleteById } from '../controllers/user.controller.js';
import { verifyAdmin } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyAdmin, getAll);

router.get('/:id', getById);

router.delete('/:id', verifyAdmin, deleteById);

export default router;