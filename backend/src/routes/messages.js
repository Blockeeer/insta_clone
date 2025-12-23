const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');

// All routes require authentication
router.use(authenticate);

// Conversations
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);

// Messages
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.put('/conversations/:conversationId/read', markAsRead);

module.exports = router;
