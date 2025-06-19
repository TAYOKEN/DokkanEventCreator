        // Données initiales basées sur le fichier fourni
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
                            <label>Enemy Skill IDs (comma separated):</label>
                            <textarea class="skills-input" 
                                      onchange="updateEnemySkills(${phaseIndex}, ${enemyIndex}, this.value)"
                                      placeholder="9660, 1750, 530">${enemy.enemy_skill_ids.join(', ')}</textarea>
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

        function addPhase() {
            const battleInfo = eventData.events["3"].content.battle_info;
            const enemies = eventData.events["3"].content.enemies;
            
            // Ajouter une nouvelle phase avec les valeurs par défaut
            battleInfo.push({
                "after_script_id": null,
                "background_id": 168,
                "before_script_id": null,
                "bgm_id": 414,
                "charge_limit": 0,
                "charge_limit_script_id": null,
                "round_id": 78500011
            });
            
            // Ajouter un ennemi par défaut
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
            if (confirm('Are you sure you want to delete this enemy?')) {
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

        function updateEnemySkills(phaseIndex, enemyIndex, skillsString) {
            const skills = skillsString.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
            eventData.events["3"].content.enemies[phaseIndex][enemyIndex].enemy_skill_ids = skills;
        }

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

        // Initialisation au chargement de la page
        window.onload = initializeEditor;
