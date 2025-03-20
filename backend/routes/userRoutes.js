const express = require('express');
const router = express.Router();
const jwt = require("../config/jwt");
const auth = require("../controllers/authController");
const { 
  registerUser, 
  getUserByInviteCode, 
  updateScore,
  getUserScore 
} = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', auth.authenticate)
router.get('/score/:username', jwt.verifyToken, getUserScore);
router.get('/invite/:inviteCode', jwt.verifyToken,getUserByInviteCode);
router.post('/update-score', jwt.verifyToken, updateScore);

module.exports = router;