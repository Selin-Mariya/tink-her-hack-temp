-- Sample Test Data for Campus Skill-Match Engine
-- This file contains sample users, skills, interests, and availability data
-- Use this to populate the database with test data

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE team_members;
-- TRUNCATE TABLE teams;
-- TRUNCATE TABLE availability;
-- TRUNCATE TABLE interests;
-- TRUNCATE TABLE skills;
-- TRUNCATE TABLE users;

-- ==================== SAMPLE USERS ====================
INSERT INTO users (name, email, password, branch) VALUES
-- Password: password123 (bcrypt hashed)
('John Doe', 'john@example.com', '$2a$10$C9x4lXYpfb6HvSI1XqI1Z.PXxM9lW5f0X.ZJ5wZQF5m8nIFKRpkVe', 'Computer Science'),
('Jane Smith', 'jane@example.com', '$2a$10$C9x4lXYpfb6HvSI1XqI1Z.PXxM9lW5f0X.ZJ5wZQF5m8nIFKRpkVe', 'Information Technology'),
('Mike Johnson', 'mike@example.com', '$2a$10$C9x4lXYpfb6HvSI1XqI1Z.PXxM9lW5f0X.ZJ5wZQF5m8nIFKRpkVe', 'Computer Science'),
('Sarah Williams', 'sarah@example.com', '$2a$10$C9x4lXYpfb6HvSI1XqI1Z.PXxM9lW5f0X.ZJ5wZQF5m8nIFKRpkVe', 'Information Technology'),
('Alex Brown', 'alex@example.com', '$2a$10$C9x4lXYpfb6HvSI1XqI1Z.PXxM9lW5f0X.ZJ5wZQF5m8nIFKRpkVe', 'Computer Engineering');

-- ==================== SKILLS FOR USER 1 (John) ====================
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
(1, 'Python', 'Advanced'),
(1, 'JavaScript', 'Intermediate'),
(1, 'Database Design', 'Intermediate');

-- ==================== SKILLS FOR USER 2 (Jane) ====================
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
(2, 'Web Development', 'Advanced'),
(2, 'React', 'Intermediate'),
(2, 'UI/UX Design', 'Advanced');

-- ==================== SKILLS FOR USER 3 (Mike) ====================
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
(3, 'Python', 'Intermediate'),
(3, 'Machine Learning', 'Beginner'),
(3, 'Data Analysis', 'Intermediate');

-- ==================== SKILLS FOR USER 4 (Sarah) ====================
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
(4, 'JavaScript', 'Advanced'),
(4, 'Web Development', 'Advanced'),
(4, 'Database Design', 'Intermediate');

-- ==================== SKILLS FOR USER 5 (Alex) ====================
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
(5, 'Cybersecurity', 'Intermediate'),
(5, 'Network Administration', 'Advanced'),
(5, 'Linux', 'Intermediate');

-- ==================== INTERESTS FOR USER 1 (John) ====================
INSERT INTO interests (user_id, interest_name) VALUES
(1, 'AI'),
(1, 'Web Dev'),
(1, 'Machine Learning');

-- ==================== INTERESTS FOR USER 2 (Jane) ====================
INSERT INTO interests (user_id, interest_name) VALUES
(2, 'Web Dev'),
(2, 'Mobile Dev'),
(2, 'UI/UX Design');

-- ==================== INTERESTS FOR USER 3 (Mike) ====================
INSERT INTO interests (user_id, interest_name) VALUES
(3, 'AI'),
(3, 'Machine Learning'),
(3, 'Data Science');

-- ==================== INTERESTS FOR USER 4 (Sarah) ====================
INSERT INTO interests (user_id, interest_name) VALUES
(4, 'Web Dev'),
(4, 'DevOps'),
(4, 'Cloud Computing');

-- ==================== INTERESTS FOR USER 5 (Alex) ====================
INSERT INTO interests (user_id, interest_name) VALUES
(5, 'Cybersecurity'),
(5, 'Cloud Computing'),
(5, 'DevOps');

-- ==================== AVAILABILITY FOR USER 1 (John) ====================
INSERT INTO availability (user_id, time_slot) VALUES
(1, 'Morning'),
(1, 'Afternoon'),
(1, 'Evening');

-- ==================== AVAILABILITY FOR USER 2 (Jane) ====================
INSERT INTO availability (user_id, time_slot) VALUES
(2, 'Afternoon'),
(2, 'Evening'),
(2, 'Weekend');

-- ==================== AVAILABILITY FOR USER 3 (Mike) ====================
INSERT INTO availability (user_id, time_slot) VALUES
(3, 'Morning'),
(3, 'Afternoon'),
(3, 'Weekend');

-- ==================== AVAILABILITY FOR USER 4 (Sarah) ====================
INSERT INTO availability (user_id, time_slot) VALUES
(4, 'Morning'),
(4, 'Evening'),
(4, 'Weekend');

-- ==================== AVAILABILITY FOR USER 5 (Alex) ====================
INSERT INTO availability (user_id, time_slot) VALUES
(5, 'Afternoon'),
(5, 'Evening'),
(5, 'Weekend');

-- ==================== SAMPLE TEAM ====================
-- Create a sample team with John as creator and Jane, Mike as members
INSERT INTO teams (team_name, created_by) VALUES
('AI Development Project', 1);

-- Add team members
INSERT INTO team_members (team_id, user_id) VALUES
(1, 1), -- John (creator)
(1, 2), -- Jane
(1, 3); -- Mike

-- ==================== VERIFICATION QUERIES ====================
-- Run these to verify the data was inserted correctly:
/*
SELECT * FROM users;
SELECT * FROM skills;
SELECT * FROM interests;
SELECT * FROM availability;
SELECT * FROM teams;
SELECT * FROM team_members;

-- Get user 1 with all their data
SELECT u.*, s.skill_name, s.skill_level, i.interest_name, a.time_slot
FROM users u
LEFT JOIN skills s ON u.id = s.user_id
LEFT JOIN interests i ON u.id = i.user_id
LEFT JOIN availability a ON u.id = a.user_id
WHERE u.id = 1;
*/
