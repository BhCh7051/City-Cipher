const express = require('express');
const router = express.Router();
const jwt = require('../config/jwt');
const { 
  getRandomDestination, 
  checkAnswer 
} = require('../controllers/destinationController');

router.get('/random', jwt.verifyToken,  getRandomDestination);
router.post('/check-answer', jwt.verifyToken, checkAnswer);

module.exports = router;