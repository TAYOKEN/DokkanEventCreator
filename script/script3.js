let selectedCardData = null;
let categories = [];
let currentViewId = 1; // Default view ID

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    setupCardSearch();
    setupBossCardIdInput();
    hideSelectedCard();
    hideSQLOutput();
});

// Setup card search functionality
function setupCardSearch() {
    const searchInput = document.getElementById('cardSearch');
    const resultsDiv = document.getElementById('cardResults');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 2) {
            searchCards(query);
        } else {
            resultsDiv.innerHTML = '';
            resultsDiv.style.display = 'none';
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card-search-container')) {
            resultsDiv.style.display = 'none';
        }
    });
}

// Mock card search function (replace with actual API call)
function searchCards(query) {
    const resultsDiv = document.getElementById('cardResults');
    
    // Mock data - replace with actual API call
    const mockCards = [
        { id: 1001001, name: "Goku (Ultra Instinct)", type: "STR", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
        { id: 1002001, name: "Vegeta (Super Saiyan Blue)", type: "AGL", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
        { id: 1003001, name: "Gohan (Ultimate)", type: "INT", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" }
    ];
    
    const filteredCards = mockCards.filter(card => 
        card.name.toLowerCase().includes(query.toLowerCase()) || 
        card.id.toString().includes(query)
    );
    
    if (filteredCards.length > 0) {
        resultsDiv.innerHTML = filteredCards.map(card => 
            `<div class="card-result-item" onclick="selectCard(${card.id}, '${card.name}', '${card.type}', '${card.image}')">
                <img src="${card.image}" alt="${card.name}">
                <div>
                    <div class="card-name">${card.name}</div>
                    <div class="card-id">ID: ${card.id}</div>
                    <span class="type-badge type-${card.type.toLowerCase()}">${card.type}</span>
                </div>
            </div>`
        ).join('');
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.innerHTML = '<div class="no-results">No cards found</div>';
        resultsDiv.style.display = 'block';
    }
}

// Select a card from search results
function selectCard(id, name, type, image) {
    selectedCardData = { id, name, type, image };
    
    document.getElementById('selectedCardImage').src = image;
    document.getElementById('selectedCardName').textContent = name;
    document.getElementById('selectedCardId').textContent = `ID: ${id}`;
    document.getElementById('selectedCardType').textContent = type;
    document.getElementById('selectedCardType').className = `type-badge type-${type.toLowerCase()}`;
    
    document.getElementById('selectedCard').style.display = 'block';
    document.getElementById('cardResults').style.display = 'none';
    document.getElementById('cardSearch').value = name;
}

// Setup boss card ID input
function setupBossCardIdInput() {
    const bossCardIdInput = document.getElementById('bossCardId');
    const idSuffix = document.getElementById('idSuffix');
    
    bossCardIdInput.addEventListener('input', function() {
        const value = this.value.replace(/\D/g, '').substring(0, 5);
        this.value = value;
        
        if (value.length === 5) {
            idSuffix.textContent = `${value}000 / ${value}001`;
            idSuffix.style.color = '#28a745';
        } else {
            idSuffix.textContent = '###000 / ###001';
            idSuffix.style.color = '#6c757d';
        }
    });
}

// Hide selected card initially
function hideSelectedCard() {
    document.getElementById('selectedCard').style.display = 'none';
}

// Hide SQL output initially
function hideSQLOutput() {
    document.getElementById('sqlOutput').style.display = 'none';
}

// Load categories (mock data)
function loadCategories() {
    // Mock categories data - replace with actual API call
    const mockCategories = [
        { id: 1, name: "Goku's Family", description: "Cards featuring Goku and his family members" },
        { id: 2, name: "Majin Buu Saga", description: "Cards from the Majin Buu Saga" },
        { id: 3, name: "Pure Saiyans", description: "Cards featuring pure-blooded Saiyans" },
        { id: 4, name: "Super Saiyans", description: "Cards in Super Saiyan forms" },
        { id: 5, name: "Final Trump Card", description: "Cards with ultimate techniques" },
        { id: 6, name: "Kamehameha", description: "Cards that can perform Kamehameha" },
        { id: 7, name: "Legendary Existence", description: "Legendary character cards" },
        { id: 8, name: "Bond of Master and Disciple", description: "Master-disciple relationship cards" }
    ];
    
    categories = mockCategories;
    renderCategories();
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(category => 
        `<div class="category-item">
            <input type="checkbox" id="cat_${category.id}" value="${category.id}">
            <label for="cat_${category.id}">
                <div class="category-name">${category.name}</div>
                <div class="category-desc">${category.description}</div>
            </label>
        </div>`
    ).join('');
}

function addSpecialEffect() {
    const container = document.getElementById('specialEffectsContainer');
    const newEffect = document.createElement('div');
    newEffect.className = 'special-effect-item';
    newEffect.innerHTML = `
        <button type="button" class="remove-effect-btn" onclick="removeEffect(this)">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Effect Type</label>
                <select class="effect-type">
                    <option value="Special::NormalEfficacySpecial">Normal Efficacy Special</option>
                    <option value="Special::BuffEfficacySpecial">Buff Efficacy Special</option>
                    <option value="Special::DebuffEfficacySpecial">Debuff Efficacy Special</option>
                </select>
            </div>
            <div class="form-group">
                <label>Efficacy Type</label>
                <input type="number" class="efficacy-type" placeholder="e.g., 3" min="0">
            </div>
            <div class="form-group">
                <label>Target Type</label>
                <input type="number" class="target-type" placeholder="e.g., 1" min="0">
            </div>
            <div class="form-group">
                <label>Calculation Option</label>
                <input type="number" class="calc-option" placeholder="e.g., 2" min="0">
            </div>
            <div class="form-group">
                <label>Turn Duration</label>
                <input type="number" class="turn" placeholder="e.g., 99" min="0">
            </div>
            <div class="form-group">
                <label>Probability (%)</label>
                <input type="number" class="prob" placeholder="e.g., 100" min="0" max="100">
            </div>
            <div class="form-group">
                <label>Effect Value 1</label>
                <input type="number" class="eff-value1" placeholder="e.g., 25" min="0">
            </div>
            <div class="form-group">
                <label>Effect Value 2</label>
                <input type="number" class="eff-value2" placeholder="e.g., 25" min="0">
            </div>
            <div class="form-group">
                <label>Effect Value 3</label>
                <input type="number" class="eff-value3" placeholder="e.g., 0" min="0">
            </div>
        </div>
    `;
    container.appendChild(newEffect);
}

function removeEffect(button) {
    const container = document.getElementById('specialEffectsContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Au moins un effet spécial est requis.');
    }
}

function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('#categoriesGrid input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

function getSpecialEffects() {
    const effects = [];
    const effectItems = document.querySelectorAll('.special-effect-item');
    
    effectItems.forEach((item, index) => {
        const effectType = item.querySelector('.effect-type').value;
        const efficacyType = item.querySelector('.efficacy-type').value;
        const targetType = item.querySelector('.target-type').value;
        const calcOption = item.querySelector('.calc-option').value;
        const turn = item.querySelector('.turn').value;
        const prob = item.querySelector('.prob').value;
        const effValue1 = item.querySelector('.eff-value1').value;
        const effValue2 = item.querySelector('.eff-value2').value;
        const effValue3 = item.querySelector('.eff-value3').value;
        
        effects.push({
            id: index + 1,
            effectType,
            efficacyType: efficacyType || 0,
            targetType: targetType || 0,
            calcOption: calcOption || 0,
            turn: turn || 0,
            prob: prob || 0,
            effValue1: effValue1 || 0,
            effValue2: effValue2 || 0,
            effValue3: effValue3 || 0
        });
    });
    
    return effects;
}

function validateForm() {
    const errors = [];
    
    if (!selectedCardData) {
        errors.push('Veuillez sélectionner une carte de base');
    }
    
    const bossCardId = document.getElementById('bossCardId').value;
    if (!bossCardId || bossCardId.length !== 5) {
        errors.push('L\'ID de la carte boss doit contenir exactement 5 chiffres');
    }
    
    const specialName = document.getElementById('specialName').value.trim();
    if (!specialName) {
        errors.push('Le nom de l\'attaque spéciale est requis');
    }
    
    const specialDescription = document.getElementById('specialDescription').value.trim();
    if (!specialDescription) {
        errors.push('La description de l\'attaque spéciale est requise');
    }
    
    if (errors.length > 0) {
        alert('Erreurs de validation:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

function generateSQL() {
    if (!validateForm()) {
        return;
    }
    
    const bossCardId = document.getElementById('bossCardId').value;
    const specialName = document.getElementById('specialName').value.trim();
    const specialDescription = document.getElementById('specialDescription').value.trim();
    const increaseRate = document.getElementById('increaseRate').value || 100;
    const lvBonus = document.getElementById('lvBonus').value || 0;
    const selectedCategories = getSelectedCategories();
    const specialEffects = getSpecialEffects();
    
    const cardId000 = `${bossCardId}000`;
    const cardId001 = `${bossCardId}001`;
    
    addViewIdInput();
    
    let sql = `-- Boss Card Creator SQL Generated\n-- View ID: ${currentViewId}\n-- Base Card: ${selectedCardData.name} (ID: ${selectedCardData.id})\n\n`;
    
    sql += `-- Insert boss card entries\n`;
    sql += `INSERT INTO cards (id, view_id, name, rarity, type, cost, hp, atk, def, leader_skill_id, special_id, passive_id, link_skill_id, category_id, created_at, updated_at)\n`;
    sql += `SELECT ${cardId000}, ${currentViewId}, '${specialName}', COALESCE(rarity, 'UR'), COALESCE(type, 'STR'), COALESCE(cost, 58), COALESCE(hp, 15000), COALESCE(atk, 18000), COALESCE(def, 12000), COALESCE(leader_skill_id, 1), COALESCE(special_id, 1), COALESCE(passive_id, 1), COALESCE(link_skill_id, 1), COALESCE(category_id, 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP\n`;
    sql += `FROM cards WHERE id = ${selectedCardData.id} LIMIT 1;\n\n`;
    
    sql += `INSERT INTO cards (id, view_id, name, rarity, type, cost, hp, atk, def, leader_skill_id, special_id, passive_id, link_skill_id, category_id, created_at, updated_at)\n`;
    sql += `SELECT ${cardId001}, ${currentViewId}, '${specialName}', COALESCE(rarity, 'UR'), COALESCE(type, 'STR'), COALESCE(cost, 58), COALESCE(hp, 15000), COALESCE(atk, 18000), COALESCE(def, 12000), COALESCE(leader_skill_id, 1), COALESCE(special_id, 1), COALESCE(passive_id, 1), COALESCE(link_skill_id, 1), COALESCE(category_id, 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP\n`;
    sql += `FROM cards WHERE id = ${selectedCardData.id} LIMIT 1;\n\n`;
    
    sql += `-- Special attack configuration\n`;
    sql += `INSERT INTO special_attacks (id, view_id, name, description, increase_rate, lv_bonus, created_at, updated_at) VALUES\n`;
    sql += `(${bossCardId}, ${currentViewId}, '${specialName}', '${specialDescription}', ${increaseRate}, ${lvBonus}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n\n`;
    
    if (specialEffects.length > 0) {
        sql += `-- Special effects\n`;
        sql += `INSERT INTO special_effects (special_id, view_id, effect_type, efficacy_type, target_type, calc_option, turn, prob, eff_value1, eff_value2, eff_value3, created_at, updated_at) VALUES\n`;
        
        const effectsSql = specialEffects.map(effect => 
            `(${bossCardId}, ${currentViewId}, '${effect.effectType}', ${effect.efficacyType}, ${effect.targetType}, ${effect.calcOption}, ${effect.turn}, ${effect.prob}, ${effect.effValue1}, ${effect.effValue2}, ${effect.effValue3}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        ).join(',\n');
        
        sql += effectsSql + ';\n\n';
    }
    
    if (selectedCategories.length > 0) {
        sql += `-- Category assignments\n`;
        sql += `INSERT INTO card_categories (card_id, view_id, category_id, created_at, updated_at) VALUES\n`;
        
        const categoriesSql = [];
        selectedCategories.forEach(categoryId => {
            categoriesSql.push(`(${cardId000}, ${currentViewId}, ${categoryId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
            categoriesSql.push(`(${cardId001}, ${currentViewId}, ${categoryId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
        });
        
        sql += categoriesSql.join(',\n') + ';\n\n';
    }
    
    sql += `-- Update boss cards with base card data\n`;
    sql += `UPDATE cards c1 SET \n`;
    sql += `    rarity = COALESCE((SELECT rarity FROM cards WHERE id = ${selectedCardData.id}), c1.rarity),\n`;
    sql += `    type = COALESCE((SELECT type FROM cards WHERE id = ${selectedCardData.id}), c1.type),\n`;
    sql += `    leader_skill_id = COALESCE((SELECT leader_skill_id FROM cards WHERE id = ${selectedCardData.id}), c1.leader_skill_id),\n`;
    sql += `    passive_id = COALESCE((SELECT passive_id FROM cards WHERE id = ${selectedCardData.id}), c1.passive_id),\n`;
    sql += `    link_skill_id = COALESCE((SELECT link_skill_id FROM cards WHERE id = ${selectedCardData.id}), c1.link_skill_id),\n`;
    sql += `    updated_at = CURRENT_TIMESTAMP\n`;
    sql += `WHERE c1.id IN (${cardId000}, ${cardId001}) AND c1.view_id = ${currentViewId};\n\n`;
    
    sql += `-- Boss Card Creation Complete\n`;
    sql += `-- Cards Created: ${cardId000}, ${cardId001}\n`;
    sql += `-- Special Attack ID: ${bossCardId}\n`;
    sql += `-- View ID: ${currentViewId}`;
    
    document.getElementById('sqlContent').textContent = sql;
    document.getElementById('sqlOutput').style.display = 'block';
    
    document.getElementById('sqlOutput').scrollIntoView({ behavior: 'smooth' });
}

function addViewIdInput() {
    const existingInput = document.getElementById('viewIdInput');
    if (existingInput) return;
    
    const section = document.querySelector('.section');
    const viewIdDiv = document.createElement('div');
    viewIdDiv.className = 'form-group';
    viewIdDiv.id = 'viewIdInput';
    viewIdDiv.innerHTML = `
        <label>View ID</label>
        <input type="number" id="viewId" value="${currentViewId}" min="1" onchange="updateViewId(this.value)">
        <small style="color: #6c757d; margin-top: 5px; display: block;">
            Change the view ID for database versioning
        </small>
    `;
    
    section.appendChild(viewIdDiv);
}

function updateViewId(newViewId) {
    currentViewId = parseInt(newViewId) || 1;
}

function copySQL() {
    const sqlContent = document.getElementById('sqlContent').textContent;
    navigator.clipboard.writeText(sqlContent).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copié!';
        copyBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        alert('Erreur lors de la copie du SQL');
    });
}