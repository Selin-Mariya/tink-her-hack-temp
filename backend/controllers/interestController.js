const interestModel = require('../models/interestModel');

// Add interest
const addInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interestName } = req.body;

    if (!interestName) {
      return res.status(400).json({ error: 'Interest name is required' });
    }

    const interestId = await interestModel.addInterest(userId, interestName);

    res.status(201).json({
      message: 'Interest added successfully',
      interest: { id: interestId, interestName }
    });
  } catch (error) {
    console.error('Add interest error:', error);
    res.status(500).json({ error: 'Failed to add interest' });
  }
};

// Get all interests
const getInterests = async (req, res) => {
  try {
    const userId = req.user.id;
    const interests = await interestModel.getInterestsByUserId(userId);

    res.json({ interests });
  } catch (error) {
    console.error('Fetch interests error:', error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
};

// Delete interest
const deleteInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const deleted = await interestModel.deleteInterest(interestId);

    if (!deleted) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    res.json({ message: 'Interest deleted successfully' });
  } catch (error) {
    console.error('Delete interest error:', error);
    res.status(500).json({ error: 'Failed to delete interest' });
  }
};

module.exports = {
  addInterest,
  getInterests,
  deleteInterest
};
