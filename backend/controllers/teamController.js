/**
 * Team Controller
 * Handles team creation and team member management
 */

const pool = require('../config/database');

/**
 * Create a new team with selected members
 * Validates at least 1 member is selected
 */
const createTeam = async (req, res) => {
  try {
    const createdBy = req.user.id;
    const { teamName, selectedMembers } = req.body;

    // Validate input
    if (!teamName) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    if (!selectedMembers || selectedMembers.length === 0) {
      return res.status(400).json({ error: 'At least 1 member must be selected' });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert team
      const [teamResult] = await connection.query(
        'INSERT INTO teams (team_name, created_by) VALUES (?, ?)',
        [teamName, createdBy]
      );
      const teamId = teamResult.insertId;

      // Insert team creator as a member
      await connection.query(
        'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
        [teamId, createdBy]
      );

      // Insert selected members
      for (const memberId of selectedMembers) {
        // Validate member ID to prevent SQL injection
        if (typeof memberId !== 'number' || memberId <= 0) {
          throw new Error('Invalid member ID');
        }

        await connection.query(
          'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
          [teamId, memberId]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        message: 'Team created successfully',
        team: { id: teamId, teamName, createdBy }
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

/**
 * Get all teams for the current user (as creator or member)
 */
const getTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all teams where user is creator or member
    const [teams] = await pool.query(`
      SELECT DISTINCT t.id, t.team_name, t.created_by, t.created_at,
        u.name as created_by_name
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.created_by = ? OR tm.user_id = ?
      ORDER BY t.created_at DESC
    `, [userId, userId]);

    // For each team, get members
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const [members] = await pool.query(`
          SELECT u.id, u.name, u.email, u.branch
          FROM team_members tm
          JOIN users u ON tm.user_id = u.id
          WHERE tm.team_id = ?
        `, [team.id]);

        return {
          id: team.id,
          teamName: team.team_name,
          createdBy: team.created_by,
          createdByName: team.created_by_name,
          createdAt: team.created_at,
          members
        };
      })
    );

    res.json({
      message: 'Teams retrieved successfully',
      teams: teamsWithMembers
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

/**
 * Get a specific team with all its members
 */
const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Check if user is part of the team
    const [teamCheck] = await pool.query(`
      SELECT t.id FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      WHERE t.id = ? AND (t.created_by = ? OR tm.user_id = ?)
    `, [teamId, userId, userId]);

    if (teamCheck.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access to this team' });
    }

    // Get team details
    const [teamData] = await pool.query(`
      SELECT t.id, t.team_name, t.created_by, t.created_at,
        u.name as created_by_name
      FROM teams t
      JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `, [teamId]);

    if (teamData.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const team = teamData[0];

    // Get all members
    const [members] = await pool.query(`
      SELECT u.id, u.name, u.email, u.branch
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = ?
    `, [teamId]);

    res.json({
      team: {
        id: team.id,
        teamName: team.team_name,
        createdBy: team.created_by,
        createdByName: team.created_by_name,
        createdAt: team.created_at,
        members
      }
    });
  } catch (error) {
    console.error('Get team by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById
};
