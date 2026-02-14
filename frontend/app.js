const API = (window.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/match';

const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');
const emptyEl = document.getElementById('empty');

let matches = [];

function clamp(n){return Math.max(0,Math.min(100,Math.round(n)))}

function scoreClass(score){
  if(score>=75) return 'high';
  if(score>=50) return 'medium';
  return 'low';
}

function renderCards(list){
  cardsEl.innerHTML='';
  if(!list.length){ emptyEl.classList.remove('hidden'); return }
  emptyEl.classList.add('hidden');
  list.forEach(m=>{
    const c = document.createElement('div');
    c.className='card dashboard-card';

    const compat = clamp(m.compatibility || m.score || Math.floor(Math.random()*100));
    const comp = document.createElement('div');
    comp.className='compat '+scoreClass(compat);
    comp.textContent = compat+'%';

    const meta = document.createElement('div'); meta.className='meta';
    const avatar = document.createElement('div'); avatar.className='avatar';
    avatar.textContent = (m.name||m.user||'U').slice(0,2).toUpperCase();
    const info = document.createElement('div');
    const name = document.createElement('div'); name.className='name'; name.textContent = m.name || m.user || 'Unknown';
    const sub = document.createElement('div'); sub.className='sub'; sub.textContent = m.branch ? m.branch : (m.email||'')
    info.appendChild(name); info.appendChild(sub);
    meta.appendChild(avatar); meta.appendChild(info);

    const desc = document.createElement('p'); desc.textContent = m.description || (m.note || 'No additional info');

    const skillsWrap = document.createElement('div'); skillsWrap.className='skills';
    (m.skills||m.skill_list||[]).slice(0,6).forEach(s=>{
      const sp = document.createElement('div'); sp.className='skill'; sp.textContent = s.name || s || s.skill || s.title; skillsWrap.appendChild(sp);
    });

    c.appendChild(comp);
    c.appendChild(meta);
    c.appendChild(desc);
    c.appendChild(skillsWrap);
    cardsEl.appendChild(c);
  });
}

function applyFilters(){
  const q = (searchEl.value||'').toLowerCase().trim();
  const f = filterEl.value;
  let list = matches.filter(m=>{
    if(!q) return true;
    const hay = (m.name+ ' ' + (m.skills||[]).map(s=>s.name||s).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  if(f==='high') list = list.filter(x=>(x.compatibility||x.score||0)>=75);
  if(f==='medium') list = list.filter(x=>{const s=(x.compatibility||x.score||0); return s>=50 && s<75});
  if(f==='low') list = list.filter(x=>(x.compatibility||x.score||0)<50);
  renderCards(list);
}

async function load(){
  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    // expect array
    matches = Array.isArray(data) ? data : (data.matches || []);
  }catch(e){
    // fallback sample
    matches = [
      {name:'Priya R', branch:'CSE', description:'Frontend enthusiast', skills:['React','HTML','CSS'], compatibility:88},
      {name:'Aman K', branch:'ECE', description:'Hardware and ML', skills:['Python','ML','C++'], compatibility:72},
      {name:'Sara L', branch:'IT', description:'Backend dev', skills:['Node.js','SQL','APIs'], compatibility:63}
    ];
  }
  applyFilters();
}

searchEl.addEventListener('input', applyFilters);
filterEl.addEventListener('change', applyFilters);

load();
const API_BASE_URL = 'http://localhost:5000/api';
let currentToken = localStorage.getItem('token');
let currentStudent = JSON.parse(localStorage.getItem('student')) || null;
let selectedMembersForTeam = []; // Store selected members for team creation

// ==================== Helper Functions ====================
const showError = (elementId, message) => {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
};

const clearError = (elementId) => {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
};

const makeRequest = async (endpoint, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (currentToken) {
        options.headers['Authorization'] = `Bearer ${currentToken}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Request failed');
        }

        return responseData;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

// ==================== Authentication ====================
const setupAuthListeners = () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById(`${tabName}Form`).classList.add('active');

            clearError('loginError');
            clearError('registerError');
        });
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError('loginError');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const data = await makeRequest('/auth/login', 'POST', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('student', JSON.stringify(data.user));

            currentToken = data.token;
            currentStudent = data.user;

            showDashboard();
            loadProfile();
            loadSkills();
            loadInterests();
            loadAvailability();
            loadTeams();
        } catch (error) {
            showError('loginError', error.message);
        }
    });

    // Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError('registerError');

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const branch = document.getElementById('registerBranch').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const data = await makeRequest('/auth/register', 'POST', {
                name,
                email,
                password,
                branch
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('student', JSON.stringify(data.user));

            currentToken = data.token;
            currentStudent = data.user;

            showDashboard();
            loadProfile();
            loadSkills();
            loadInterests();
            loadAvailability();
            loadTeams();
        } catch (error) {
            showError('registerError', error.message);
        }
    });
};

// ==================== Dashboard Navigation ====================
const setupNavigationListeners = () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const logoutBtn = document.getElementById('logoutBtn');

    navButtons.forEach(btn => {
        if (!btn.classList.contains('logout-btn')) {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                switchSection(section);

                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        currentToken = null;
        currentStudent = null;
        selectedMembersForTeam = [];

        document.getElementById('dashboardPage').classList.remove('active');
        document.getElementById('authPage').classList.add('active');

        // Reset forms
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        document.querySelectorAll('.tab-btn')[0].click();
    });
};

const switchSection = (sectionName) => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${sectionName}Section`).classList.add('active');
};

// ==================== Profile Management ====================
const loadProfile = async () => {
    try {
        const data = await makeRequest('/auth/profile');
        currentStudent = data.user;
        localStorage.setItem('student', JSON.stringify(data.user));

        document.getElementById('profileName').textContent = data.user.name;
        document.getElementById('profileEmail').textContent = data.user.email;
        document.getElementById('profileBranch').textContent = data.user.branch;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
};

// ==================== Skills Management ====================
const setupSkillsListeners = () => {
    const addSkillBtn = document.getElementById('addSkillBtn');
    const cancelSkillBtn = document.getElementById('cancelSkillBtn');
    const skillForm = document.querySelector('.skill-form');

    addSkillBtn.addEventListener('click', () => {
        document.getElementById('addSkillForm').classList.remove('hidden');
    });

    cancelSkillBtn.addEventListener('click', () => {
        document.getElementById('addSkillForm').classList.add('hidden');
        skillForm.reset();
    });

    skillForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const skillName = document.getElementById('skillName').value;
        const skillLevel = document.getElementById('skillLevel').value;

        try {
            await makeRequest('/skills', 'POST', { skillName, skillLevel });
            skillForm.reset();
            document.getElementById('addSkillForm').classList.add('hidden');
            loadSkills();
        } catch (error) {
            console.error('Error adding skill:', error);
        }
    });
};

const loadSkills = async () => {
    try {
        const data = await makeRequest('/skills');
        const skillsList = document.getElementById('skillsList');

        if (data.skills.length === 0) {
            skillsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><p>No skills added yet</p></div>';
            return;
        }

        skillsList.innerHTML = data.skills.map(skill => `
            <div class="item-card">
                <div class="item-content">
                    <div class="item-name">${skill.skill_name}</div>
                    <span class="item-level ${skill.skill_level.toLowerCase()}">${skill.skill_level}</span>
                </div>
                <div class="item-actions">
                    <button onclick="deleteSkill(${skill.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading skills:', error);
    }
};

const deleteSkill = async (skillId) => {
    if (confirm('Are you sure you want to delete this skill?')) {
        try {
            await makeRequest(`/skills/${skillId}`, 'DELETE');
            loadSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    }
};

// ==================== Interests Management ====================
const setupInterestsListeners = () => {
    const addInterestBtn = document.getElementById('addInterestBtn');
    const cancelInterestBtn = document.getElementById('cancelInterestBtn');
    const interestForm = document.querySelector('.interest-form');

    addInterestBtn.addEventListener('click', () => {
        document.getElementById('addInterestForm').classList.remove('hidden');
    });

    cancelInterestBtn.addEventListener('click', () => {
        document.getElementById('addInterestForm').classList.add('hidden');
        interestForm.reset();
    });

    interestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const interestName = document.getElementById('interestName').value;

        try {
            await makeRequest('/interests', 'POST', { interestName });
            interestForm.reset();
            document.getElementById('addInterestForm').classList.add('hidden');
            loadInterests();
        } catch (error) {
            console.error('Error adding interest:', error);
        }
    });
};

const loadInterests = async () => {
    try {
        const data = await makeRequest('/interests');
        const interestsList = document.getElementById('interestsList');

        if (data.interests.length === 0) {
            interestsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⭐</div><p>No interests added yet</p></div>';
            return;
        }

        interestsList.innerHTML = data.interests.map(interest => `
            <div class="item-card">
                <div class="item-content">
                    <div class="item-name">${interest.interest_name}</div>
                </div>
                <div class="item-actions">
                    <button onclick="deleteInterest(${interest.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading interests:', error);
    }
};

const deleteInterest = async (interestId) => {
    if (confirm('Are you sure you want to delete this interest?')) {
        try {
            await makeRequest(`/interests/${interestId}`, 'DELETE');
            loadInterests();
        } catch (error) {
            console.error('Error deleting interest:', error);
        }
    }
};

// ==================== Availability Management ====================
const setupAvailabilityListeners = () => {
    const addAvailabilityBtn = document.getElementById('addAvailabilityBtn');
    const cancelAvailabilityBtn = document.getElementById('cancelAvailabilityBtn');
    const availabilityForm = document.querySelector('.availability-form');

    addAvailabilityBtn.addEventListener('click', () => {
        document.getElementById('addAvailabilityForm').classList.remove('hidden');
    });

    cancelAvailabilityBtn.addEventListener('click', () => {
        document.getElementById('addAvailabilityForm').classList.add('hidden');
        availabilityForm.reset();
    });

    availabilityForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const timeSlot = document.getElementById('availabilitySlot').value;

        try {
            await makeRequest('/availability', 'POST', { timeSlot });
            availabilityForm.reset();
            document.getElementById('addAvailabilityForm').classList.add('hidden');
            loadAvailability();
        } catch (error) {
            console.error('Error adding availability:', error);
        }
    });
};

const loadAvailability = async () => {
    try {
        const data = await makeRequest('/availability');
        const availabilityList = document.getElementById('availabilityList');

        if (data.availability.length === 0) {
            availabilityList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🕐</div><p>No availability added yet</p></div>';
            return;
        }

        availabilityList.innerHTML = data.availability.map(avail => `
            <div class="item-card">
                <div class="item-content">
                    <div class="item-name">${avail.time_slot}</div>
                </div>
                <div class="item-actions">
                    <button onclick="deleteAvailability(${avail.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading availability:', error);
    }
};

const deleteAvailability = async (availabilityId) => {
    if (confirm('Are you sure you want to delete this availability slot?')) {
        try {
            await makeRequest(`/availability/${availabilityId}`, 'DELETE');
            loadAvailability();
        } catch (error) {
            console.error('Error deleting availability:', error);
        }
    }
};

// ==================== Matching Feature ====================
const setupMatchingListeners = () => {
    const findMatchesBtn = document.getElementById('findMatchesBtn');

    findMatchesBtn.addEventListener('click', async () => {
        findMatchesBtn.disabled = true;
        findMatchesBtn.textContent = '🔄 Finding Matches...';

        try {
            await loadMatches();
        } catch (error) {
            console.error('Error finding matches:', error);
        } finally {
            findMatchesBtn.disabled = false;
            findMatchesBtn.textContent = '🔍 Find Matches';
        }
    });
};

const loadMatches = async () => {
    try {
        const data = await makeRequest('/match');
        const matchesContainer = document.getElementById('matchesContainer');

        if (data.topMatches.length === 0) {
            matchesContainer.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state-icon">🤝</div><p>No teammates found. Add more skills and interests to find matches!</p></div>';
            return;
        }

        matchesContainer.innerHTML = data.topMatches.map(match => `
            <div class="match-card">
                <div class="match-header">
                    <div>
                        <div class="match-name">${match.name}</div>
                        <div class="match-branch">${match.branch}</div>
                    </div>
                    <div class="compatibility-badge">${match.compatibilityScore}%</div>
                </div>

                <div class="match-details">
                    <div class="match-detail-item">
                        <div class="match-detail-label">Matching Skills</div>
                        <div class="skills-tags">
                            ${match.matchingSkills.length > 0 
                                ? match.matchingSkills.map(skill => `<span class="tag">${skill}</span>`).join('')
                                : '<span style="color: #9ca3af; font-size: 12px;">No common skills</span>'
                            }
                        </div>
                    </div>

                    <div class="match-detail-item">
                        <div class="match-detail-label">Match Scores</div>
                        <div style="font-size: 12px; color: var(--dark-color);">
                            Skills: ${match.skillMatch}% | Interests: ${match.interestMatch}% | Availability: ${match.availabilityMatch}%
                        </div>
                    </div>

                    <div class="match-detail-item">
                        <div class="match-detail-label">Common Interests</div>
                        <div class="interests-tags">
                            ${match.commonInterests.length > 0 
                                ? match.commonInterests.map(interest => `<span class="tag">${interest}</span>`).join('')
                                : '<span style="color: #9ca3af; font-size: 12px;">No common interests</span>'
                            }
                        </div>
                    </div>

                    <div class="match-detail-item">
                        <div class="match-detail-label">Common Availability</div>
                        <div class="interests-tags">
                            ${match.commonAvailability.length > 0 
                                ? match.commonAvailability.map(slot => `<span class="tag">${slot}</span>`).join('')
                                : '<span style="color: #9ca3af; font-size: 12px;">No common slots</span>'
                            }
                        </div>
                    </div>
                </div>

                <div class="match-actions">
                    <button class="select-member-btn" onclick="toggleMemberSelection(${match.id}, '${match.name}')" id="member-${match.id}">
                        ☐ Select
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading matches:', error);
        document.getElementById('matchesContainer').innerHTML = '<div class="empty-state"><p>Failed to load matches</p></div>';
    }
};

// ==================== Team Management ====================
const toggleMemberSelection = (memberId, memberName) => {
    const btn = document.getElementById(`member-${memberId}`);
    const index = selectedMembersForTeam.findIndex(m => m.id === memberId);

    if (index > -1) {
        selectedMembersForTeam.splice(index, 1);
        btn.textContent = '☐ Select';
        btn.classList.remove('selected');
    } else {
        selectedMembersForTeam.push({ id: memberId, name: memberName });
        btn.textContent = '☑ Selected';
        btn.classList.add('selected');
    }

    updateSelectedMembersList();
};

const updateSelectedMembersList = () => {
    const list = document.getElementById('selectedMembersList');
    
    if (selectedMembersForTeam.length === 0) {
        list.innerHTML = '<span style="color: #9ca3af; font-size: 13px;">No members selected</span>';
        return;
    }

    list.innerHTML = selectedMembersForTeam.map(member => `
        <div class="selected-member-tag">
            ${member.name}
            <button type="button" onclick="removeMemberSelection(${member.id})">×</button>
        </div>
    `).join('');
};

const removeMemberSelection = (memberId) => {
    const index = selectedMembersForTeam.findIndex(m => m.id === memberId);
    if (index > -1) {
        selectedMembersForTeam.splice(index, 1);
        const btn = document.getElementById(`member-${memberId}`);
        if (btn) {
            btn.textContent = '☐ Select';
            btn.classList.remove('selected');
        }
        updateSelectedMembersList();
    }
};

const setupTeamListeners = () => {
    const teamForm = document.querySelector('.team-form');
    const cancelTeamBtn = document.getElementById('cancelTeamBtn');

    cancelTeamBtn.addEventListener('click', () => {
        document.getElementById('createTeamForm').classList.add('hidden');
        teamForm.reset();
        selectedMembersForTeam = [];
        updateSelectedMembersList();
    });

    teamForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const teamName = document.getElementById('teamName').value;

        if (selectedMembersForTeam.length === 0) {
            alert('Please select at least 1 member');
            return;
        }

        try {
            await makeRequest('/teams', 'POST', {
                teamName,
                selectedMembers: selectedMembersForTeam.map(m => m.id)
            });

            alert('Team created successfully!');
            teamForm.reset();
            document.getElementById('createTeamForm').classList.add('hidden');
            selectedMembersForTeam = [];
            updateSelectedMembersList();
            loadTeams();
        } catch (error) {
            alert('Error creating team: ' + error.message);
        }
    });
};

const loadTeams = async () => {
    try {
        const data = await makeRequest('/teams');
        const teamsList = document.getElementById('teamsList');

        if (data.teams.length === 0) {
            teamsList.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">👥</div>
                    <p>No teams yet. Find teammates and create your first team!</p>
                    <button class="btn btn-primary" onclick="document.getElementById('createTeamForm').classList.remove('hidden'); document.getElementById('findMatchesBtn').click();">Start Building</button>
                </div>
            `;
            return;
        }

        teamsList.innerHTML = data.teams.map(team => `
            <div class="team-card">
                <div class="team-card-header">
                    <div class="team-card-title">${team.teamName}</div>
                    <div class="team-card-meta">Created by ${team.createdByName}</div>
                </div>

                <div class="team-members-section">
                    <label class="team-members-label">Members (${team.members.length})</label>
                    <div class="team-members">
                        ${team.members.map(member => `
                            <div class="team-member">
                                <div>
                                    <div class="team-member-name">${member.name}</div>
                                    <div class="team-member-branch">${member.branch}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading teams:', error);
    }
};

// ==================== Page Display ====================
const showAuthPage = () => {
    document.getElementById('authPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
};

const showDashboard = () => {
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (currentToken && currentStudent) {
        showDashboard();
        loadProfile();
        loadSkills();
        loadInterests();
        loadAvailability();
        loadTeams();
    } else {
        showAuthPage();
    }

    setupAuthListeners();
    setupNavigationListeners();
    setupSkillsListeners();
    setupInterestsListeners();
    setupAvailabilityListeners();
    setupMatchingListeners();
    setupTeamListeners();
});

