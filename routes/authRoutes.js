const express = require('express');
const { route } = require('../app');
const router = express.Router();
const authController = require('../controllers/authController') 

router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;