import express from 'express'
import { getAll, getById, deleteById, update, updateRoles } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyAdmin, getAll);

router.get('/:id', getById);

router.delete('/:id', verifyAdmin, deleteById);

router.patch('/', verifyUser, update);

router.patch('/role', verifyAdmin, updateRoles);

export default router;