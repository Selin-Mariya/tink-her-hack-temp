const skillModel = require('../models/skillModel');

// Add skill
const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, skillLevel } = req.body;

    if (!skillName || !skillLevel) {
      return res.status(400).json({ error: 'Skill name and level are required' });
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(skillLevel)) {
      return res.status(400).json({ error: 'Invalid skill level' });
    }

    const skillId = await skillModel.addSkill(userId, skillName, skillLevel);

    res.status(201).json({
      message: 'Skill added successfully',
      skill: { id: skillId, skillName, skillLevel }
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

// Get all skills
const getSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const skills = await skillModel.getSkillsByUserId(userId);

    res.json({ skills });
  } catch (error) {
    console.error('Fetch skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { skillName, skillLevel } = req.body;

    if (!skillName || !skillLevel) {
      return res.status(400).json({ error: 'Skill name and level are required' });
    }

    if (!['Beginner', 'Intermediate', 'Advanced'].includes(skillLevel)) {
      return res.status(400).json({ error: 'Invalid skill level' });
    }

    const updated = await skillModel.updateSkill(skillId, skillName, skillLevel);

    if (!updated) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const deleted = await skillModel.deleteSkill(skillId);

    if (!deleted) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

module.exports = {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill
};
