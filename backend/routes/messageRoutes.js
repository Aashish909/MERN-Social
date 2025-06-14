import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { getAllMessages, sendMessage } from "../controllers/messageController.js";


const router = express.Router();

router.post('/', isAuth, sendMessage)
router.get('/:id', isAuth, getAllMessages)

export default router;