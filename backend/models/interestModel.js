const pool = require('../config/database');

// Add interest for user
const addInterest = async (userId, interestName) => {
  const [result] = await pool.query(
    'INSERT INTO interests (user_id, interest_name) VALUES (?, ?)',
    [userId, interestName]
  );
  return result.insertId;
};

// Get all interests for user
const getInterestsByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM interests WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Delete interest
const deleteInterest = async (interestId) => {
  const [result] = await pool.query(
    'DELETE FROM interests WHERE id = ?',
    [interestId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  addInterest,
  getInterestsByUserId,
  deleteInterest
};
