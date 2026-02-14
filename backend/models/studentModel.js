const pool = require('../config/database');

// Get user by email
const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Get user by ID
const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Get all users except the current user
const getAllUsersExcept = async (userId) => {
  const [rows] = await pool.query('SELECT id, name, email, branch, created_at FROM users WHERE id != ? ORDER BY created_at DESC', [userId]);
  return rows;
};

// Create user
const createUser = async (name, email, hashedPassword, branch) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, branch) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, branch]
  );
  return result.insertId;
};

// Update user profile
const updateUser = async (id, name, branch) => {
  const [result] = await pool.query(
    'UPDATE users SET name = ?, branch = ? WHERE id = ?',
    [name, branch, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsersExcept,
  createUser,
  updateUser
};
