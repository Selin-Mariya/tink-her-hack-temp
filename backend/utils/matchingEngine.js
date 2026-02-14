/**
 * Matching Algorithm for Campus Skill-Match Engine
 * Calculates compatibility score between two students based on:
 * - Skills match (50% weight)
 * - Interests match (30% weight)
 * - Availability overlap (20% weight)
 */

/**
 * Calculate skill match percentage
 * @param {Array} userSkills - Current user's skills
 * @param {Array} candidateSkills - Candidate user's skills
 * @returns {number} Skill match percentage (0-100)
 */
const calculateSkillMatch = (userSkills, candidateSkills) => {
  if (userSkills.length === 0 || candidateSkills.length === 0) {
    return 0;
  }

  const userSkillNames = userSkills.map(s => s.skill_name.toLowerCase());
  const candidateSkillNames = candidateSkills.map(s => s.skill_name.toLowerCase());

  // Find common skills
  const commonSkills = userSkillNames.filter(skill =>
    candidateSkillNames.includes(skill)
  );

  // Calculate match percentage
  const maxSkills = Math.max(userSkillNames.length, candidateSkillNames.length);
  return (commonSkills.length / maxSkills) * 100;
};

/**
 * Calculate interest match percentage
 * @param {Array} userInterests - Current user's interests
 * @param {Array} candidateInterests - Candidate user's interests
 * @returns {number} Interest match percentage (0-100)
 */
const calculateInterestMatch = (userInterests, candidateInterests) => {
  if (userInterests.length === 0 || candidateInterests.length === 0) {
    return 0;
  }

  const userInterestNames = userInterests.map(i => i.interest_name.toLowerCase());
  const candidateInterestNames = candidateInterests.map(i => i.interest_name.toLowerCase());

  // Find common interests
  const commonInterests = userInterestNames.filter(interest =>
    candidateInterestNames.includes(interest)
  );

  // Calculate match percentage
  const maxInterests = Math.max(userInterestNames.length, candidateInterestNames.length);
  return (commonInterests.length / maxInterests) * 100;
};

/**
 * Calculate availability overlap percentage
 * @param {Array} userAvailability - Current user's availability slots
 * @param {Array} candidateAvailability - Candidate user's availability slots
 * @returns {number} Availability match percentage (0-100)
 */
const calculateAvailabilityMatch = (userAvailability, candidateAvailability) => {
  if (userAvailability.length === 0 || candidateAvailability.length === 0) {
    return 0;
  }

  const userSlots = userAvailability.map(a => a.time_slot.toLowerCase());
  const candidateSlots = candidateAvailability.map(a => a.time_slot.toLowerCase());

  // Find overlapping slots
  const commonSlots = userSlots.filter(slot =>
    candidateSlots.includes(slot)
  );

  // Calculate match percentage
  const maxSlots = Math.max(userSlots.length, candidateSlots.length);
  return (commonSlots.length / maxSlots) * 100;
};

/**
 * Calculate overall compatibility score using weighted formula
 * Formula: Score = (Skill Match * 0.5) + (Interest Match * 0.3) + (Availability Match * 0.2)
 *
 * @param {Array} userSkills - Current user's skills
 * @param {Array} userInterests - Current user's interests
 * @param {Array} userAvailability - Current user's availability
 * @param {Array} candidateSkills - Candidate user's skills
 * @param {Array} candidateInterests - Candidate user's interests
 * @param {Array} candidateAvailability - Candidate user's availability
 * @returns {Object} Compatibility details including score and match percentages
 */
const calculateCompatibilityScore = (
  userSkills,
  userInterests,
  userAvailability,
  candidateSkills,
  candidateInterests,
  candidateAvailability
) => {
  const skillMatch = calculateSkillMatch(userSkills, candidateSkills);
  const interestMatch = calculateInterestMatch(userInterests, candidateInterests);
  const availabilityMatch = calculateAvailabilityMatch(userAvailability, candidateAvailability);

  // Weighted formula
  const compatibilityScore = (skillMatch * 0.5) + (interestMatch * 0.3) + (availabilityMatch * 0.2);

  return {
    compatibilityScore: Math.round(compatibilityScore),
    skillMatch: Math.round(skillMatch),
    interestMatch: Math.round(interestMatch),
    availabilityMatch: Math.round(availabilityMatch)
  };
};

/**
 * Find matching skills between two users
 * @param {Array} userSkills - Current user's skills
 * @param {Array} candidateSkills - Candidate user's skills
 * @returns {Array} Array of matching skill names
 */
const findMatchingSkills = (userSkills, candidateSkills) => {
  if (userSkills.length === 0 || candidateSkills.length === 0) {
    return [];
  }

  const userSkillMap = userSkills.map(s => s.skill_name.toLowerCase());
  const candidateSkillNames = candidateSkills.map(s => s.skill_name);

  return candidateSkillNames.filter(skill =>
    userSkillMap.includes(skill.toLowerCase())
  );
};

/**
 * Calculate requirement-based match percentage
 * @param {Array} requiredSkills - Skills required by client (lowercase)
 * @param {Array} userSkills - User's skills array
 * @returns {Object} { matchPercentage, matchedSkills, category }
 */
const calculateRequirementMatch = (requiredSkills, userSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchPercentage: 0, matchedSkills: [], category: 'No Requirements' };
  }

  const userSkillNames = userSkills.map(s => s.skill_name.toLowerCase());

  // Find matching skills
  const matchedSkills = requiredSkills.filter(skill => userSkillNames.includes(skill));

  // Calculate percentage
  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  // Determine category
  let category = 'Weak Match';
  if (matchPercentage >= 70) category = 'Strong Match';
  else if (matchPercentage >= 40) category = 'Moderate Match';

  return { matchPercentage, matchedSkills, category };
};

module.exports = {
  calculateSkillMatch,
  calculateInterestMatch,
  calculateAvailabilityMatch,
  calculateCompatibilityScore,
  findMatchingSkills,
  calculateRequirementMatch
};
