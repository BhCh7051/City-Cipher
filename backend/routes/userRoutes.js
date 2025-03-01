const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  getUserByInviteCode, 
  updateScore 
} = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/invite/:inviteCode', getUserByInviteCode);
router.post('/update-score', updateScore);

module.exports = router;