const supabase = require('../config/supabase');

// Get user by email
const getUserByEmail = async (email) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).limit(1).maybeSingle();
  if (error) throw error;
  return data || null;
};

// Get user by ID
const getUserById = async (id) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1).maybeSingle();
  if (error) throw error;
  return data || null;
};

// Get all users except the current user
const getAllUsersExcept = async (userId) => {
  let query = supabase.from('users').select('id, name, email, branch, created_at');
  if (userId !== null) {
    query = query.neq('id', userId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Create user
const createUser = async (name, email, hashedPassword, branch) => {
  const { data, error } = await supabase.from('users').insert([{ name, email, password: hashedPassword, branch }]).select('id').single();
  if (error) throw error;
  return data.id;
};

// Update user profile
const updateUser = async (id, name, branch) => {
  const { error } = await supabase.from('users').update({ name, branch }).eq('id', id);
  if (error) throw error;
  return true;
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsersExcept,
  createUser,
  updateUser
};
