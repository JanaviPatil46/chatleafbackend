const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protector = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
router.get("/", protector, userController.getAllUsers);
router.put("/profile", protector, upload.single('profilePic'), userController.updateUserProfile);

module.exports = router;
