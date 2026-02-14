const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All skill routes require authentication
router.post('/', authenticateToken, skillController.addSkill);
router.get('/', authenticateToken, skillController.getSkills);
router.put('/:skillId', authenticateToken, skillController.updateSkill);
router.delete('/:skillId', authenticateToken, skillController.deleteSkill);

module.exports = router;
