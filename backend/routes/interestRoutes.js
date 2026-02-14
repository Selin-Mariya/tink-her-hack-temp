const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All interest routes require authentication
router.post('/', authenticateToken, interestController.addInterest);
router.get('/', authenticateToken, interestController.getInterests);
router.delete('/:interestId', authenticateToken, interestController.deleteInterest);

module.exports = router;
