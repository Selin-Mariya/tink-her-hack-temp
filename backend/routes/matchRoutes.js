const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All match routes require authentication
router.get('/', authenticateToken, matchController.findMatches);

module.exports = router;
