const API_BASE_URL = 'php/skills_api.php';

// Global Variable for enemy skills management (impoirtante)
let availableSkills = [];
let selectedSkills = [];
let currentSkillContext = null;
let currentPage = 0;
let totalSkills = 0;
const SKILLS_PER_PAGE = 20;

// maybe change the reference idkkkk
let eventData = {
    "dice": {
        "nums": [
            {"num": 1, "weight": 0},
            {"num": 2, "weight": 0},
            {"num": 3, "weight": 100},
            {"num": 4, "weight": 0},
            {"num": 5, "weight": 0},
            {"num": 6, "weight": 0}
        ]
    },
    "events": {
        "0": {
            "content": {"script_id": 0},
            "type": 501
        },
        "3": {
            "content": {
                "after_script_id": 0,
                "battle_info": [
                    {
                        "after_script_id": null,
                        "background_id": 168,
                        "before_script_id": null,
                        "bgm_id": 414,
                        "charge_limit": 0,
                        "charge_limit_script_id": null,
                        "round_id": 78500011
                    }
                ],
                "battle_round_condition_sets": [],
                "before_script_id": 0,
                "enemies": [
                    [
                        {
                            "ai_type": 64,
                            "attack": 420000,
                            "card_id": 1030431,
                            "defence": 1050000,
                            "enemy_skill_ids": [9660, 1750, 530],
                            "exp": 0,
                            "extra_hp_gauges_count": 0,
                            "finish_special_inform_hp": 0,
                            "first_turn": 0,
                            "hp": 50000000,
                            "is_finish_special_only": false,
                            "is_necessary_to_defeat": true,
                            "multi_atk_num": 6,
                            "turn": 0,
                            "zeni": 0
                        }
                    ]
                ],
                "link_skill_lv_up": []
            },
            "type": 301
        },
        "4": {
            "content": {"script_id": 0},
            "type": 502
        }
    },
    "first_focus_step": 3,
    "map": "712_001"
};

function initializeEditor() {
    renderPhases();
    updateJSON();
}

function renderPhases() {
    const container = document.getElementById('phasesContainer');
    container.innerHTML = '';
    
    const battleInfo = eventData.events["3"].content.battle_info;
    const enemies = eventData.events["3"].content.enemies;
    
    enemies.forEach((phase, phaseIndex) => {
        const phaseCard = createPhaseCard(phase, phaseIndex, battleInfo[phaseIndex] || {});
        container.appendChild(phaseCard);
    });
}

function createPhaseCard(enemies, phaseIndex, battleInfo) {
    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'phase-card';
    phaseDiv.innerHTML = `
        <div class="phase-header">
            <h3 class="phase-title">Phase ${phaseIndex + 1}</h3>
            <div class="phase-controls">
                <button class="btn btn-success" onclick="addEnemy(${phaseIndex})">➕ Enemy</button>
                <button class="btn btn-danger" onclick="removePhase(${phaseIndex})">🗑️ Delete</button>
            </div>
        </div>
        
        <div class="battle-info">
            <div class="form-group">
                <label>Background ID:</label>
                <input type="number" value="${battleInfo.background_id || 168}" 
                       onchange="updateBattleInfo(${phaseIndex}, 'background_id', this.value)">
            </div>
            <div class="form-group">
                <label>BGM ID:</label>
                <input type="number" value="${battleInfo.bgm_id || 414}" 
                       onchange="updateBattleInfo(${phaseIndex}, 'bgm_id', this.value)">
            </div>
            <div class="form-group">
                <label>Round ID:</label>
                <input type="number" value="${battleInfo.round_id || 78500011}" 
                       onchange="updateBattleInfo(${phaseIndex}, 'round_id', this.value)">
            </div>
            <div class="form-group">
                <label>Charge Limit:</label>
                <input type="number" value="${battleInfo.charge_limit || 0}" 
                       onchange="updateBattleInfo(${phaseIndex}, 'charge_limit', this.value)">
            </div>
        </div>
        
        <div class="enemies-container">
            <h4 style="margin-bottom: 15px; color: #495057;">👹 Enemies (${enemies.length})</h4>
            <div id="enemies-${phaseIndex}">
                ${enemies.map((enemy, enemyIndex) => createEnemyCard(enemy, phaseIndex, enemyIndex)).join('')}
            </div>
        </div>
    `;
    return phaseDiv;
}

function createEnemyCard(enemy, phaseIndex, enemyIndex) {
    return `
        <div class="enemy-card">
            <div class="enemy-header">
                <span class="enemy-title">Enemy ${enemyIndex + 1}</span>
                <button class="btn btn-danger" onclick="removeEnemy(${phaseIndex}, ${enemyIndex})">🗑️</button>
            </div>
            
            <div class="enemy-stats">
                <div class="form-group">
                    <label>AI Type:</label>
                    <input type="number" value="${enemy.ai_type}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'ai_type', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>Attack:</label>
                    <input type="number" value="${enemy.attack}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'attack', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>Defence:</label>
                    <input type="number" value="${enemy.defence}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'defence', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>HP:</label>
                    <input type="number" value="${enemy.hp}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'hp', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>Card ID:</label>
                    <input type="number" value="${enemy.card_id}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'card_id', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>Multi Attack:</label>
                    <input type="number" value="${enemy.multi_atk_num}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'multi_atk_num', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>Extra HP Gauges:</label>
                    <input type="number" value="${enemy.extra_hp_gauges_count}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'extra_hp_gauges_count', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label>First Turn:</label>
                    <input type="number" value="${enemy.first_turn}" 
                           onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'first_turn', parseInt(this.value))">
                </div>
            </div>
            
            <div class="skills-container">
                <div class="form-group">
                    <label>Enemy Skills:</label>
                    <div class="skills-selector">
                        <button class="btn btn-primary" onclick="openSkillModal(${phaseIndex}, ${enemyIndex})">
                            🔍 Select from Database
                        </button>
                        <button class="btn btn-secondary" onclick="toggleManualSkillInput(${phaseIndex}, ${enemyIndex})">
                            ✏️ Manual Input
                        </button>
                    </div>
                    <div class="skills-display" id="skills-display-${phaseIndex}-${enemyIndex}">
                        ${renderSkillsDisplay(enemy.enemy_skill_ids)}
                    </div>
                    <div class="manual-input" id="manual-input-${phaseIndex}-${enemyIndex}" style="display: none;">
                        <textarea class="skills-input" 
                                  onchange="updateEnemySkillsManual(${phaseIndex}, ${enemyIndex}, this.value)"
                                  placeholder="Enter skill IDs separated by commas (e.g., 9660, 1750, 530)">${enemy.enemy_skill_ids.join(', ')}</textarea>
                    </div>
                </div>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" ${enemy.is_finish_special_only ? 'checked' : ''} 
                       onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'is_finish_special_only', this.checked)">
                <label>Finish Special Only</label>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" ${enemy.is_necessary_to_defeat ? 'checked' : ''} 
                       onchange="updateEnemy(${phaseIndex}, ${enemyIndex}, 'is_necessary_to_defeat', this.checked)">
                <label>Necessary to Defeat</label>
            </div>
        </div>
    `;
}

function renderSkillsDisplay(skillIds) {
    if (!skillIds || skillIds.length === 0) {
        return '<span style="color: #6c757d; font-style: italic;">No skills selected</span>';
    }
    
    return skillIds.map(id => 
        `<span class="skill-tag" title="Skill ID: ${id}">${id}</span>`
    ).join('');
}

function addPhase() {
    const battleInfo = eventData.events["3"].content.battle_info;
    const enemies = eventData.events["3"].content.enemies;
    
    // Add a new battle info
    battleInfo.push({
        "after_script_id": null,
        "background_id": 168,
        "before_script_id": null,
        "bgm_id": 414,
        "charge_limit": 0,
        "charge_limit_script_id": null,
        "round_id": 78500011
    });
    
    // New phase = new enemy either way kaboom
    enemies.push([{
        "ai_type": 64,
        "attack": 420000,
        "card_id": 1030431,
        "defence": 1050000,
        "enemy_skill_ids": [9660, 1750, 530],
        "exp": 0,
        "extra_hp_gauges_count": 0,
        "finish_special_inform_hp": 0,
        "first_turn": 0,
        "hp": 50000000,
        "is_finish_special_only": false,
        "is_necessary_to_defeat": true,
        "multi_atk_num": 6,
        "turn": 0,
        "zeni": 0
    }]);
    
    renderPhases();
}

function removePhase(phaseIndex) {
    if (confirm('Are you sure you want to delete this phase?')) {
        eventData.events["3"].content.battle_info.splice(phaseIndex, 1);
        eventData.events["3"].content.enemies.splice(phaseIndex, 1);
        renderPhases();
    }
}

function addEnemy(phaseIndex) {
    const newEnemy = {
        "ai_type": 64,
        "attack": 420000,
        "card_id": 1030431,
        "defence": 1050000,
        "enemy_skill_ids": [9660, 1750, 530],
        "exp": 0,
        "extra_hp_gauges_count": 0,
        "finish_special_inform_hp": 0,
        "first_turn": 0,
        "hp": 50000000,
        "is_finish_special_only": false,
        "is_necessary_to_defeat": true,
        "multi_atk_num": 6,
        "turn": 0,
        "zeni": 0
    };
    
    eventData.events["3"].content.enemies[phaseIndex].push(newEnemy);
    renderPhases();
}

function removeEnemy(phaseIndex, enemyIndex) {
    if (confirm('Are you sure you want to delete this enemy?')) { // Are you sure ?
        eventData.events["3"].content.enemies[phaseIndex].splice(enemyIndex, 1);
        renderPhases();
    }
}

function updateBattleInfo(phaseIndex, field, value) {
    if (!eventData.events["3"].content.battle_info[phaseIndex]) {
        eventData.events["3"].content.battle_info[phaseIndex] = {};
    }
    eventData.events["3"].content.battle_info[phaseIndex][field] = parseInt(value);
}

function updateEnemy(phaseIndex, enemyIndex, field, value) {
    eventData.events["3"].content.enemies[phaseIndex][enemyIndex][field] = value;
}

function updateEnemySkillsManual(phaseIndex, enemyIndex, skillsString) {
    const skills = skillsString.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
    eventData.events["3"].content.enemies[phaseIndex][enemyIndex].enemy_skill_ids = skills;
    
    // Update the display
    const displayElement = document.getElementById(`skills-display-${phaseIndex}-${enemyIndex}`);
    if (displayElement) {
        displayElement.innerHTML = renderSkillsDisplay(skills);
    }
}

function toggleManualSkillInput(phaseIndex, enemyIndex) {
    const manualInput = document.getElementById(`manual-input-${phaseIndex}-${enemyIndex}`);
    const skillsDisplay = document.getElementById(`skills-display-${phaseIndex}-${enemyIndex}`);
    
    if (manualInput.style.display === 'none') {
        manualInput.style.display = 'block';
        skillsDisplay.style.display = 'none';
    } else {
        manualInput.style.display = 'none';
        skillsDisplay.style.display = 'block';
    }
}

// Skill Modal Functions
function openSkillModal(phaseIndex, enemyIndex) {
    currentSkillContext = { phaseIndex, enemyIndex };
    
    // Get current skills for this enemy
    const currentSkills = eventData.events["3"].content.enemies[phaseIndex][enemyIndex].enemy_skill_ids || [];
    selectedSkills = [...currentSkills];
    
    const modal = document.getElementById('skillModal');
    modal.style.display = 'block';
    
    loadSkills();
    updateSelectedSkillsDisplay();
}

function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    modal.style.display = 'none';
    currentSkillContext = null;
    selectedSkills = [];
    availableSkills = [];
    currentPage = 0;
}

async function loadSkills(search = '') {
    try {
        const params = new URLSearchParams({
            action: 'search',
            search: search,
            limit: SKILLS_PER_PAGE,
            offset: currentPage * SKILLS_PER_PAGE
        });
        
        const response = await fetch(`${API_BASE_URL}?${params}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        availableSkills = data.skills || [];
        totalSkills = data.total || 0;
        
        renderSkillsList();
        renderPagination();
        
    } catch (error) {
        console.error('Error loading skills:', error);
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = `<div class="loading">Error loading skills: ${error.message}</div>`;
    }
}

function renderSkillsList() {
    const skillsList = document.getElementById('skillsList');
    
    if (availableSkills.length === 0) {
        skillsList.innerHTML = '<div class="loading">No skills found</div>';
        return;
    }
    
    skillsList.innerHTML = availableSkills.map(skill => {
        const isSelected = selectedSkills.includes(parseInt(skill.id));
        return `
            <div class="skill-item ${isSelected ? 'selected' : ''}" onclick="toggleSkillSelection(${skill.id})">
                <div class="skill-info">
                    <div class="skill-name">${skill.name || 'Unnamed Skill'}</div>
                    <div class="skill-id">ID: ${skill.id}</div>
                    <div class="skill-description">${skill.description || 'No description available'}</div>
                    <div class="skill-values">
                        Type: ${skill.efficacy_type || 'N/A'} | 
                        Values: ${skill.eff_value1 || 0}, ${skill.eff_value2 || 0}, ${skill.eff_value3 || 0}
                    </div>
                </div>
                <input type="checkbox" class="skill-checkbox" ${isSelected ? 'checked' : ''} 
                       onchange="event.stopPropagation(); toggleSkillSelection(${skill.id})">
            </div>
        `;
    }).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(totalSkills / SKILLS_PER_PAGE);
    const pagination = document.getElementById('skillsPagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 0 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;
    
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    if (startPage > 0) {
        paginationHTML += `<button onclick="changePage(0)">1</button>`;
        if (startPage > 1) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i + 1}
            </button>
        `;
    }
    
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            paginationHTML += `<span>...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages - 1})">${totalPages}</button>`;
    }
    
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages - 1 ? 'disabled' : ''}>
            Next →
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(newPage) {
    const totalPages = Math.ceil(totalSkills / SKILLS_PER_PAGE);
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
        currentPage = newPage;
        loadSkills(document.getElementById('skillSearch').value);
    }
}

function searchSkills() {
    currentPage = 0;
    const searchTerm = document.getElementById('skillSearch').value;
    loadSkills(searchTerm);
}

function toggleSkillSelection(skillId) {
    const id = parseInt(skillId);
    const index = selectedSkills.indexOf(id);
    
    if (index === -1) {
        selectedSkills.push(id);
    } else {
        selectedSkills.splice(index, 1);
    }
    
    updateSelectedSkillsDisplay();
    renderSkillsList(); // Re-render to update selection state
}

function updateSelectedSkillsDisplay() {
    const selectedSkillsList = document.getElementById('selectedSkillsList');
    
    if (selectedSkills.length === 0) {
        selectedSkillsList.innerHTML = '<span style="color: #6c757d; font-style: italic;">No skills selected</span>';
        return;
    }
    
    selectedSkillsList.innerHTML = selectedSkills.map(id => 
        `<span class="skill-tag" onclick="removeSelectedSkill(${id})" style="cursor: pointer;" title="Click to remove">
            ${id} ✕
        </span>`
    ).join('');
}

function removeSelectedSkill(skillId) {
    const index = selectedSkills.indexOf(parseInt(skillId));
    if (index !== -1) {
        selectedSkills.splice(index, 1);
        updateSelectedSkillsDisplay();
        renderSkillsList(); // Re-render to update selection state
    }
}

function confirmSkillSelection() {
    if (!currentSkillContext) return;
    
    const { phaseIndex, enemyIndex } = currentSkillContext;
    
    eventData.events["3"].content.enemies[phaseIndex][enemyIndex].enemy_skill_ids = [...selectedSkills];
    
    // Update the display in the main UI
    const displayElement = document.getElementById(`skills-display-${phaseIndex}-${enemyIndex}`);
    if (displayElement) {
        displayElement.innerHTML = renderSkillsDisplay(selectedSkills);
    }
    
    // Update manual input textarea as well
    const manualInput = document.querySelector(`#manual-input-${phaseIndex}-${enemyIndex} textarea`);
    if (manualInput) {
        manualInput.value = selectedSkills.join(', ');
    }
    
    closeSkillModal();
}

// Event listener for Enter key in search
document.addEventListener('DOMContentLoaded', function() {
    const skillSearch = document.getElementById('skillSearch');
    if (skillSearch) {
        skillSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSkills();
            }
        });
    }
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('skillModal');
        if (event.target === modal) {
            closeSkillModal();
        }
    });
});

function updateJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify(eventData, null, 2);
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
        alert('JSON copied to clipboard!');
    });
}

// Change ts into smth that import from a file loloololol
function loadFromJSON() {
    const jsonString = prompt('Paste your JSON here:');
    if (jsonString) {
        try {
            eventData = JSON.parse(jsonString);
            renderPhases();
            updateJSON();
            alert('JSON loaded successfully!');
        } catch (error) {
            alert('Error parsing JSON: ' + error.message);
        }
    }
}

window.onload = initializeEditor;