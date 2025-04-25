import express from 'express';
import { download, upload } from '../controllers/torrent.controller.js';
import { verifyUploader } from '../utils/auth.js';

const router = express.Router();

router.post('/upload', verifyUploader, upload);

router.get('/download/:id', download);

export default router;