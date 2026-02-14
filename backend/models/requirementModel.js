const supabase = require('../config/supabase');

// Get requirement with all required skills
const getRequirementWithSkills = async (requirementId) => {
  const { data: requirement, error: reqError } = await supabase
    .from('client_requirements')
    .select('*')
    .eq('id', requirementId)
    .single();
  if (reqError) throw reqError;

  const { data: skills, error: skillError } = await supabase
    .from('requirement_skills')
    .select('skill_name')
    .eq('requirement_id', requirementId);
  if (skillError) throw skillError;

  return {
    ...requirement,
    required_skills: skills.map(s => s.skill_name.toLowerCase())
  };
};

// List all requirements
const getAllRequirements = async () => {
  const { data, error } = await supabase.from('client_requirements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

module.exports = {
  getRequirementWithSkills,
  getAllRequirements
};
