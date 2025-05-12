import express from 'express';
import { getAll, getById, upload, download, saveComment, getAllComments, rate, deleteRate, createCategory, getAllCategories, deleteCategory, updateCategory, deleteComment } from '../controllers/torrent.controller.js';
import { verifyUser, verifyUploader, verifyAdmin } from '../utils/auth.js';

const router = express.Router();

router.post('/category', verifyAdmin, createCategory);

router.get('/category', verifyUploader, getAllCategories);

router.delete('/category/:id', verifyAdmin, deleteCategory);

router.patch('/category/:id', verifyAdmin, updateCategory);


router.get('/', verifyUser, getAll);

router.get('/:id', verifyUser, getById);

router.post('/upload', verifyUploader, upload);

router.get('/download/:id', verifyUser, download);


router.post('/comment', verifyUser, saveComment);

router.get('/:id/comment', verifyUser, getAllComments);

router.delete('/:id/comment', verifyUser, deleteComment);


router.post('/:id/rate', verifyUser, rate);

router.delete('/:id/rate', verifyUser, deleteRate);

export default router;