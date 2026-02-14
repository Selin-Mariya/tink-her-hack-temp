const supabase = require('../config/supabase');

// Add interest for user
const addInterest = async (userId, interestName) => {
  const { data, error } = await supabase.from('interests').insert([{ user_id: userId, interest_name: interestName }]).select('id').single();
  if (error) throw error;
  return data.id;
};

// Get all interests for user
const getInterestsByUserId = async (userId) => {
  const { data, error } = await supabase.from('interests').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Delete interest
const deleteInterest = async (interestId) => {
  const { error } = await supabase.from('interests').delete().eq('id', interestId);
  if (error) throw error;
  return true;
};

module.exports = {
  addInterest,
  getInterestsByUserId,
  deleteInterest
};
