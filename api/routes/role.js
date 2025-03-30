import express from 'express';
import { createRole, deleteRole, getAllRoles, updateRole } from '../controllers/role.controller.js';

const router = express.Router();

// Create a new role in DB
router.post('/create', createRole);

// Update role in DB
router.put('/update/:id', updateRole);

// Get all roles from DB
router.get('/getAll', getAllRoles);

// Delete role from DB
router.delete("/deleteRole/:id", deleteRole);

export default router;