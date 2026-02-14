const pool = require('../config/database');

// Add skill for user
const addSkill = async (userId, skillName, skillLevel) => {
  const [result] = await pool.query(
    'INSERT INTO skills (user_id, skill_name, skill_level) VALUES (?, ?, ?)',
    [userId, skillName, skillLevel]
  );
  return result.insertId;
};

// Get all skills for user
const getSkillsByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Update skill
const updateSkill = async (skillId, skillName, skillLevel) => {
  const [result] = await pool.query(
    'UPDATE skills SET skill_name = ?, skill_level = ? WHERE id = ?',
    [skillName, skillLevel, skillId]
  );
  return result.affectedRows > 0;
};

// Delete skill
const deleteSkill = async (skillId) => {
  const [result] = await pool.query(
    'DELETE FROM skills WHERE id = ?',
    [skillId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  addSkill,
  getSkillsByUserId,
  updateSkill,
  deleteSkill
};
