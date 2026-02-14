const pool = require('../config/database');

// Add availability for user
const addAvailability = async (userId, timeSlot) => {
  const [result] = await pool.query(
    'INSERT INTO availability (user_id, time_slot) VALUES (?, ?)',
    [userId, timeSlot]
  );
  return result.insertId;
};

// Get all availability for user
const getAvailabilityByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM availability WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Delete availability
const deleteAvailability = async (availabilityId) => {
  const [result] = await pool.query(
    'DELETE FROM availability WHERE id = ?',
    [availabilityId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  addAvailability,
  getAvailabilityByUserId,
  deleteAvailability
};
