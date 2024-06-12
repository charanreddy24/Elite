import express from 'express';
import {
  getMessages,
  getUnreadCounts,
  sendMessage,
  unreadMessages,
} from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/unreadCounts', verifyToken, getUnreadCounts);
router.get('/unread-messages', verifyToken, unreadMessages);
router.post('/send/:id', verifyToken, sendMessage);
router.get('/:id', verifyToken, getMessages);

export default router;
