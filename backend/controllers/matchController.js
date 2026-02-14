/**
 * Matching Controller
 * Handles finding compatible teammates using the matching algorithm
 */

const pool = require('../config/database');
const skillModel = require('../models/skillModel');
const interestModel = require('../models/interestModel');
const availabilityModel = require('../models/availabilityModel');
const studentModel = require('../models/studentModel');
const { calculateCompatibilityScore, findMatchingSkills } = require('../utils/matchingEngine');

/**
 * Find matching teammates for the current user
 * Returns top 3 compatible matches sorted by compatibility score
 */
const findMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get current user's profile
    const currentUser = await studentModel.getUserById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get current user's skills, interests, and availability
    const userSkills = await skillModel.getSkillsByUserId(currentUserId);
    const userInterests = await interestModel.getInterestsByUserId(currentUserId);
    const userAvailability = await availabilityModel.getAvailabilityByUserId(currentUserId);

    // Get all other users (excluding current user)
    const allUsers = await studentModel.getAllUsersExcept(currentUserId);

    // Calculate compatibility score for each user
    const matchesWithScores = await Promise.all(
      allUsers.map(async (candidate) => {
        const candidateSkills = await skillModel.getSkillsByUserId(candidate.id);
        const candidateInterests = await interestModel.getInterestsByUserId(candidate.id);
        const candidateAvailability = await availabilityModel.getAvailabilityByUserId(candidate.id);

        const compatibility = calculateCompatibilityScore(
          userSkills,
          userInterests,
          userAvailability,
          candidateSkills,
          candidateInterests,
          candidateAvailability
        );

        const matchingSkills = findMatchingSkills(userSkills, candidateSkills);

        return {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          branch: candidate.branch,
          compatibilityScore: compatibility.compatibilityScore,
          skillMatch: compatibility.skillMatch,
          interestMatch: compatibility.interestMatch,
          availabilityMatch: compatibility.availabilityMatch,
          matchingSkills,
          commonInterests: userInterests
            .map(i => i.interest_name)
            .filter(interest =>
              candidateInterests.some(ci => ci.interest_name === interest)
            ),
          commonAvailability: userAvailability
            .map(a => a.time_slot)
            .filter(slot =>
              candidateAvailability.some(ca => ca.time_slot === slot)
            )
        };
      })
    );

    // Sort by compatibility score (highest first) and get top 3
    const topMatches = matchesWithScores
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 3);

    res.json({
      message: 'Matches found successfully',
      topMatches
    });
  } catch (error) {
    console.error('Find matches error:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
};

/**
 * Find users matching a specific client requirement
 * Returns users sorted by match percentage (highest first)
 */
const findUsersForRequirement = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const requirementModel = require('../models/requirementModel');
    const { calculateRequirementMatch } = require('../utils/matchingEngine');

    // Get requirement with all required skills
    const requirement = await requirementModel.getRequirementWithSkills(requirementId);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Get all users
    const allUsers = await studentModel.getAllUsersExcept(null); // null = get all users, but we need to modify getAllUsersExcept

    // Calculate match for each user
    const matchesWithScores = await Promise.all(
      allUsers.map(async (user) => {
        const userSkills = await skillModel.getSkillsByUserId(user.id);
        const { matchPercentage, matchedSkills, category } = calculateRequirementMatch(
          requirement.required_skills,
          userSkills
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          branch: user.branch,
          matchPercentage,
          matchCategory: category,
          matchedSkills,
          totalRequiredSkills: requirement.required_skills.length
        };
      })
    );

    // Sort by match percentage (highest first)
    const sortedMatches = matchesWithScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      message: 'Requirement-based matches found',
      requirement: {
        id: requirement.id,
        project_title: requirement.project_title,
        required_skills: requirement.required_skills
      },
      matches: sortedMatches
    });
  } catch (error) {
    console.error('Find requirement matches error:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
};

module.exports = {
  findMatches,
  findUsersForRequirement
};
