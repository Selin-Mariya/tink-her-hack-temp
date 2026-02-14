const supabase = require('../config/supabase');

// Add skill for user
const addSkill = async (userId, skillName, skillLevel) => {
  const { data, error } = await supabase.from('skills').insert([{ user_id: userId, skill_name: skillName, skill_level: skillLevel }]).select('id').single();
  if (error) throw error;
  return data.id;
};

// Get all skills for user
const getSkillsByUserId = async (userId) => {
  const { data, error } = await supabase.from('skills').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Update skill
const updateSkill = async (skillId, skillName, skillLevel) => {
  const { error } = await supabase.from('skills').update({ skill_name: skillName, skill_level: skillLevel }).eq('id', skillId);
  if (error) throw error;
  return true;
};

// Delete skill
const deleteSkill = async (skillId) => {
  const { error } = await supabase.from('skills').delete().eq('id', skillId);
  if (error) throw error;
  return true;
};

module.exports = {
  addSkill,
  getSkillsByUserId,
  updateSkill,
  deleteSkill
};
