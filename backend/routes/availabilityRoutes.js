const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All availability routes require authentication
router.post('/', authenticateToken, availabilityController.addAvailability);
router.get('/', authenticateToken, availabilityController.getAvailability);
router.delete('/:availabilityId', authenticateToken, availabilityController.deleteAvailability);

module.exports = router;
