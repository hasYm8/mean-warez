import express from 'express';
import { getAll, getById, upload, download, saveComment, getAllComments } from '../controllers/torrent.controller.js';
import { verifyUser, verifyUploader } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyUser, getAll);

router.get('/:id', verifyUser, getById);

router.post('/upload', verifyUploader, upload);

router.get('/download/:id', verifyUser, download);

router.post('/comment', verifyUser, saveComment);

router.get('/:id/comment', verifyUser, getAllComments);

export default router;