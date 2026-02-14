const availabilityModel = require('../models/availabilityModel');

// Add availability
const addAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeSlot } = req.body;

    if (!timeSlot) {
      return res.status(400).json({ error: 'Time slot is required' });
    }

    const validSlots = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
    if (!validSlots.includes(timeSlot)) {
      return res.status(400).json({ error: 'Invalid time slot' });
    }

    const availabilityId = await availabilityModel.addAvailability(userId, timeSlot);

    res.status(201).json({
      message: 'Availability added successfully',
      availability: { id: availabilityId, timeSlot }
    });
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ error: 'Failed to add availability' });
  }
};

// Get all availability slots
const getAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const availability = await availabilityModel.getAvailabilityByUserId(userId);

    res.json({ availability });
  } catch (error) {
    console.error('Fetch availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// Delete availability
const deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const deleted = await availabilityModel.deleteAvailability(availabilityId);

    if (!deleted) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
};

module.exports = {
  addAvailability,
  getAvailability,
  deleteAvailability
};
