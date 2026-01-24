 // ============ MY CREATURES ============
 async function loadMyCreatures() {
    try {
        const res = await fetch(`${API_URL}/creatures/${currentUser.id}`);
        const data = await res.json();
        myCreatures = data.creatures;
        
        document.getElementById('creatureCount').textContent = myCreatures.length;
        
        const listDiv = document.getElementById('myCreaturesList');
        
        if (myCreatures.length === 0) {
            listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No creatures yet. Go hunt!</p>';
            return;
        }
        
        listDiv.innerHTML = myCreatures.map(c => `
            <div class="creature-item ${selectedCreature && selectedCreature.id === c.id ? 'selected' : ''}" 
                 onclick="selectCreature(${c.id})">
                <div class="creature-item-header">
                    <div>
                        <strong style="color: var(--accent);">${c.Creature.name}</strong>
                        ${c.nickname ? `<span style="color: var(--text-secondary);"> (${c.nickname})</span>` : ''}
                        <div class="rarity rarity-${c.Creature.rarity}">${c.Creature.rarity.toUpperCase()}</div>
                    </div>
                    <span class="creature-type type-${c.Creature.type}">${c.Creature.type.toUpperCase()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: var(--text-secondary);">
                    <span>Level: ${c.level}</span>
                    <span>HP: ${c.currentHp}/${c.maxHp}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: var(--text-secondary);">
                    <span>ATK: ${c.attack}</span>
                    <span>DEF: ${c.defense}</span>
                    <span>EXP: ${c.exp}</span>
                </div>
                ${c.currentHp < c.maxHp ? '<button onclick="healCreature(' + c.id + '); event.stopPropagation();" style="margin-top: 10px; width: 100%;" class="success">💚 HEAL</button>' : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading creatures:', error);
    }
}

function selectCreature(creatureId) {
    selectedCreature = myCreatures.find(c => c.id === creatureId);
    
    if (!selectedCreature) return;
    
    const infoDiv = document.getElementById('selectedCreatureInfo');
    infoDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--accent); margin-bottom: 15px;">${selectedCreature.Creature.name}</h3>
            ${selectedCreature.nickname ? `<p style="color: var(--text-secondary);">"${selectedCreature.nickname}"</p>` : ''}
            <span class="creature-type type-${selectedCreature.Creature.type}" style="font-size: 1.1em; margin: 10px 0; display: inline-block;">
                ${selectedCreature.Creature.type.toUpperCase()}
            </span>
            <div class="rarity rarity-${selectedCreature.Creature.rarity}" style="font-size: 1em; margin: 5px 0;">
                ${selectedCreature.Creature.rarity.toUpperCase()}
            </div>
            
            <div style="margin: 20px 0;">
                <div class="stat-item">
                    <span class="stat-label">Level:</span>
                    <span class="stat-value">${selectedCreature.level}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">EXP:</span>
                    <span class="stat-value">${selectedCreature.exp}/${selectedCreature.level * 100}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">HP:</span>
                    <span class="stat-value">${selectedCreature.currentHp}/${selectedCreature.maxHp}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Attack:</span>
                    <span class="stat-value">${selectedCreature.attack}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Defense:</span>
                    <span class="stat-value">${selectedCreature.defense}</span>
                </div>
            </div>
            
            ${selectedCreature.currentHp < selectedCreature.maxHp ? 
                '<button onclick="healCreature(' + selectedCreature.id + ')" class="success" style="width: 100%;">💚 HEAL</button>' : 
                '<p style="color: var(--success);">✅ Healthy!</p>'}
        </div>
    `;
    
    loadMyCreatures();
}

async function healCreature(creatureId) {
    try {
        const res = await fetch(`${API_URL}/heal/${creatureId}`, { method: 'POST' });
        const data = await res.json();
        
        if (res.ok) {
            await loadMyCreatures();
            if (selectedCreature && selectedCreature.id === creatureId) {
                selectCreature(creatureId);
            }
            alert('Creature healed!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Heal error:', error);
    }
}
async function loadMyCreatures() {
    try {
        const { data } = await axios.get(`${API_URL}/creatures/${currentUser.id}`);
        myCreatures = data.creatures;
        
        document.getElementById('creatureCount').textContent = myCreatures.length;
        
        const listDiv = document.getElementById('myCreaturesList');
        
        if (myCreatures.length === 0) {
            listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No creatures yet. Go hunt!</p>';
            return;
        }
        
        listDiv.innerHTML = myCreatures.map(c => `
            <div class="creature-item ${selectedCreature && selectedCreature.id === c.id ? 'selected' : ''}" 
                 onclick="selectCreature(${c.id})">
                <div class="creature-item-header">
                    <div>
                        <strong style="color: var(--accent);">${c.Creature.name}</strong>
                        ${c.nickname ? `<span style="color: var(--text-secondary);"> (${c.nickname})</span>` : ''}
                        <div class="rarity rarity-${c.Creature.rarity}">${c.Creature.rarity.toUpperCase()}</div>
                    </div>
                    <span class="creature-type type-${c.Creature.type}">${c.Creature.type.toUpperCase()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: var(--text-secondary);">
                    <span>Level: ${c.level}</span>
                    <span>HP: ${c.currentHp}/${c.maxHp}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: var(--text-secondary);">
                    <span>ATK: ${c.attack}</span>
                    <span>DEF: ${c.defense}</span>
                    <span>EXP: ${c.exp}</span>
                </div>
                ${c.currentHp < c.maxHp ? '<button onclick="healCreature(' + c.id + '); event.stopPropagation();" style="margin-top: 10px; width: 100%;" class="success">💚 HEAL</button>' : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading creatures:', error);
    }
}

function selectCreature(creatureId) {
    selectedCreature = myCreatures.find(c => c.id === creatureId);
    
    if (!selectedCreature) return;
    
    const infoDiv = document.getElementById('selectedCreatureInfo');
    infoDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--accent); margin-bottom: 15px;">${selectedCreature.Creature.name}</h3>
            ${selectedCreature.nickname ? `<p style="color: var(--text-secondary);">"${selectedCreature.nickname}"</p>` : ''}
            <span class="creature-type type-${selectedCreature.Creature.type}" style="font-size: 1.1em; margin: 10px 0; display: inline-block;">
                ${selectedCreature.Creature.type.toUpperCase()}
            </span>
            <div class="rarity rarity-${selectedCreature.Creature.rarity}" style="font-size: 1em; margin: 5px 0;">
                ${selectedCreature.Creature.rarity.toUpperCase()}
            </div>
            
            <div style="margin: 20px 0;">
                <div class="stat-item">
                    <span class="stat-label">Level:</span>
                    <span class="stat-value">${selectedCreature.level}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">EXP:</span>
                    <span class="stat-value">${selectedCreature.exp}/${selectedCreature.level * 100}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">HP:</span>
                    <span class="stat-value">${selectedCreature.currentHp}/${selectedCreature.maxHp}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Attack:</span>
                    <span class="stat-value">${selectedCreature.attack}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Defense:</span>
                    <span class="stat-value">${selectedCreature.defense}</span>
                </div>
            </div>
            
            ${selectedCreature.currentHp < selectedCreature.maxHp ? 
                '<button onclick="healCreature(' + selectedCreature.id + ')" class="success" style="width: 100%;">💚 HEAL</button>' : 
                '<p style="color: var(--success);">✅ Healthy!</p>'}
        </div>
    `;
    
    loadMyCreatures();
}

async function healCreature(creatureId) {
    try {
        const { data } = await axios.post(`${API_URL}/heal/${creatureId}`);
        
        await loadMyCreatures();
        if (selectedCreature && selectedCreature.id === creatureId) {
            selectCreature(creatureId);
        }
        alert('Creature healed!');
    } catch (error) {
        console.error('Heal error:', error);
        if (error.response && error.response.data) {
            alert(error.response.data.error);
        }
    }
}