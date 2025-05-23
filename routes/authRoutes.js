import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authController.js';

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.login);

export default router;