const supabase = require('../config/supabase');

// Add availability for user
const addAvailability = async (userId, timeSlot) => {
  const { data, error } = await supabase.from('availability').insert([{ user_id: userId, time_slot: timeSlot }]).select('id').single();
  if (error) throw error;
  return data.id;
};

// Get all availability for user
const getAvailabilityByUserId = async (userId) => {
  const { data, error } = await supabase.from('availability').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Delete availability
const deleteAvailability = async (availabilityId) => {
  const { error } = await supabase.from('availability').delete().eq('id', availabilityId);
  if (error) throw error;
  return true;
};

module.exports = {
  addAvailability,
  getAvailabilityByUserId,
  deleteAvailability
};
