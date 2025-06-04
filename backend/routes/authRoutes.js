import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.post('/register',uploadFile, registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

export default router;