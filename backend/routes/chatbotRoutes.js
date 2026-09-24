import express from 'express';
import {
  processChatbotMessage,
  getChatbotFaqs
} from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message', processChatbotMessage);
router.get('/faqs', getChatbotFaqs);

export default router;
