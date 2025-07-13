        let stageCount = 0;
        
        function updateIds() {
            const eventId = document.getElementById('eventId').value;
            if (eventId) {
                updateAllStageIds();
            }
        }
        
        function addStage() {
            stageCount++;
            const container = document.getElementById('stagesContainer');
            
            const stageDiv = document.createElement('div');
            stageDiv.className = 'stage-card';
            stageDiv.innerHTML = `
                <div class="stage-header">
                    <h3 class="stage-title">Stage ${stageCount}</h3>
                    <button class="btn btn-danger" onclick="removeStage(this)">
                        🗑️ Remove
                    </button>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Quest ID</label>
                        <input type="text" class="quest-id readonly" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label>Area ID</label>
                        <input type="text" class="area-id readonly" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="stageName${stageCount}">Stage Name</label>
                        <input type="text" id="stageName${stageCount}" class="stage-name" placeholder="e.g., Vs. Buu Saga">
                    </div>
                </div>
            `;
            
            container.appendChild(stageDiv);
            updateAllStageIds();
        }
        
        function removeStage(button) {
            const stageCard = button.closest('.stage-card');
            stageCard.remove();
            renumberStages();
        }
        
        function renumberStages() {
            const stages = document.querySelectorAll('.stage-card');
            stageCount = stages.length;
            
            stages.forEach((stage, index) => {
                const stageNumber = index + 1;
                const title = stage.querySelector('.stage-title');
                title.textContent = `Stage ${stageNumber}`;
            });
            
            updateAllStageIds();
        }
        
        function updateAllStageIds() {
            const eventId = document.getElementById('eventId').value;
            if (!eventId) return;
            
            const stages = document.querySelectorAll('.stage-card');
            stages.forEach((stage, index) => {
                const stageNumber = String(index + 1).padStart(3, '0');
                const questId = `${eventId}0${stageNumber}`;
                const areaId = `${eventId}0`;
                
                stage.querySelector('.quest-id').value = questId;
                stage.querySelector('.area-id').value = areaId;
            });
        }
        
        function previewImage(inputId, previewId) {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(previewId);
            const url = input.value;
            
            if (url) {
                preview.innerHTML = '<span class="loading">Loading...</span>';
                
                const img = new Image();
                img.onload = function() {
                    preview.innerHTML = `<img src="${url}" alt="Preview">`; // Use <img> to make the link show up 
                };
                img.onerror = function() {
                    preview.innerHTML = '<span class="loading">Invalid image</span>';
                };
                img.src = url;
            } else {
                preview.innerHTML = '<span class="loading">No image</span>';
            }
        }
        // Create the queries
        function generateSQL() {
            const eventId = document.getElementById('eventId').value;
            const eventCategory = document.getElementById('eventCategory').value;
            const eventName = document.getElementById('eventName').value;
            const bannerImageUrl = document.getElementById('bannerImageUrl').value;
            const eventImageUrl = document.getElementById('eventImageUrl').value;
            
            if (!eventId || !eventName) {
                alert('Please fill in Event ID and Event Name');
                return;
            }
            
            const stages = document.querySelectorAll('.stage-card');
            if (stages.length === 0) {
                alert('Please add at least one stage');
                return;
            }
            
            let sql = '-- Event\n';
            const areaId = `${eventId}0`;
            const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
            
            sql += `INSERT OR REPLACE INTO areas(id,type,category,chapter_id,db_story_id,name,prev_area_id,all_clear_bonus_stones,bgm_id,event_image_path,banner_image_path,listbutton_image_path,is_listbutton_visible,event_priority,announcement_id,is_quest_num_visible,first_released_at,created_at,updated_at) VALUES(${areaId},'Area::EventArea',${eventCategory},1,NULL,'${eventName}',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,1,'${currentDate}','${currentDate}','${currentDate}');\n\n`;
            
            stages.forEach((stage, index) => {
                const stageNumber = index + 1;
                const questId = `${eventId}0${String(stageNumber).padStart(3, '0')}`;
                const stageName = stage.querySelector('.stage-name').value || `Stage ${stageNumber}`;
                
                sql += `-- Stage ${stageNumber}\n`;
                sql += `INSERT OR REPLACE INTO quests(id,area_id,name,prev_quest_id,any_clear_bonus_stones,all_clear_bonus_stones,visit_count_max,interval_reset_visited_days,can_ignore_difficulty_order,limitation_announcement_id,boostable,start_at,enable_sugoroku_auto,enable_battle_auto,created_at,updated_at) VALUES(${questId},${areaId},'${stageName}',NULL,NULL,NULL,NULL,NULL,0,NULL,0,'2022-05-09 06:30:00',1,1,'${currentDate}','${currentDate}');\n`;
                sql += `INSERT OR REPLACE INTO sugoroku_maps(id,quest_id,difficulty,sugoroku_bgm_id,battle_bgm_id,boss_bgm_id,battle_background_id,act,eventkagi_num,user_exp,zeni,start_script_id,finish_script_id,first_focus_step,dice_id,sugoroku_map_puzzle_color_id,is_cpu_only,danger_line_hp,link_skill_lv_up_prob_rate,sugoroku_map_reward_group_id,created_at,updated_at) VALUES(${questId},${questId},5,65,0,0,0,0,0,0,0,0,0,2,7,0,0,0,NULL,NULL,'${currentDate}','${currentDate}');\n`;
            });
            
            sql += '\n-- Events\n';
            stages.forEach((stage, index) => {
                const stageNumber = index + 1;
                const questId = `${eventId}0${String(stageNumber).padStart(3, '0')}`;
                const patchId = `${eventId}001`;
                
                sql += `INSERT OR REPLACE INTO events (id, patch_id, name, open_at, close_at, updated_at, created_at, banner_image_url, event_image_url) VALUES (${questId}, ${patchId}, '${eventName}', '1709502323', '9999999999', '${currentDate}', '${currentDate}', '${bannerImageUrl}', '${eventImageUrl}');\n`;
            });
            
            const output = document.getElementById('sqlOutput');
            output.textContent = sql;
            output.style.display = 'block';
            output.scrollIntoView({ behavior: 'smooth' });
        }
        
        addStage();