const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protector = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
 
router.get("/:conversationId",protector, messageController.getChatHistory);
router.post("/send",protector, messageController.sendMessage);
router.post("/upload",protector, upload.single('file'), messageController.uploadFile);

module.exports = router;