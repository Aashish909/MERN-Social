import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import {
  aiGrammarCorrect,
  aiRewrite,
  aiSummarize,
  aiSmartReply,
  aiAssistant,
  aiTranslate,
  aiModerate
} from '../controllers/aiController.js';

const router = express.Router();

// Grammar and tone correction
router.post('/grammar-correct', isAuth, aiGrammarCorrect);

// Message rewriting (with tone)
router.post('/rewrite', isAuth, aiRewrite);

// Summarize chat
router.post('/summarize', isAuth, aiSummarize);

// Smart reply suggestions
router.post('/smart-reply', isAuth, aiSmartReply);

// Chatbot assistant
router.post('/assistant', isAuth, aiAssistant);

// Translation
router.post('/translate', isAuth, aiTranslate);

// Moderation filter
router.post('/moderate', isAuth, aiModerate);

export default router; 