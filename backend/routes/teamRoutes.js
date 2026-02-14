const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All team routes require authentication
router.post('/', authenticateToken, teamController.createTeam);
router.get('/', authenticateToken, teamController.getTeams);
router.get('/:teamId', authenticateToken, teamController.getTeamById);

module.exports = router;
