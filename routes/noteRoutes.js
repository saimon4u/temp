import express from 'express';
const router = express.Router();
import NoteController from '../controllers/noteController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


router.get('/', NoteController.getAllNotes);
router.post('/', protect, admin, upload, NoteController.uploadNote);
router.get('/:id', NoteController.getNote);
router.put('/:id', protect, admin, NoteController.updateNote);
router.delete('/:id', protect, admin, NoteController.deleteNote);

export default router;