import express from 'express';
import { getAll, getById, upload, download } from '../controllers/torrent.controller.js';
import { verifyUser, verifyUploader } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyUser, getAll);

router.get('/:id', verifyUser, getById);

router.post('/upload', verifyUploader, upload);

router.get('/download/:id', verifyUser, download);

export default router;