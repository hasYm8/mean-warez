import express from 'express';
import { getAll, upload, download } from '../controllers/torrent.controller.js';
import { verifyUser, verifyUploader } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyUser, getAll);

router.post('/upload', verifyUploader, upload);

router.get('/download/:id', verifyUser, download);

export default router;