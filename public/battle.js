// ============ HUNT & BATTLE ============
async function startHunt() {
    if (!selectedCreature) {
        alert('Select a creature from MY CREATURES first!');
        return;
    }
    
    if (selectedCreature.currentHp <= 0) {
        alert('Your creature needs healing!');
        return;
    }
    
    if (battleInProgress) return;
    battleInProgress = true;
    localStorage.setItem('battle', 'true');
    try{
        const res=await axios.post(`${API_URL}/hunt`,{userId:currentUser.id,selectedCreatureId:selectedCreature.id});
        const data=res.data;
        currentEnemy=data.creature;
        currentEnemyMaxHp=currentEnemy.baseHp;
        document.getElementById('huntStatus').textContent=data.message;
        document.getElementById('battleSection').classList.remove('hidden');
        document.getElementById('huntButton').disabled=true;
        updateBattleDisplay();
        battleInProgress=true;
        document.getElementById('battleLog').innerHTML='<div class="log-entry">Battle started!</div>';
       }catch(error){
        console.error('Hunt error:',error);
       }
       
}

function updateBattleDisplay() {
    // My creature
    document.getElementById('myCreatureName').textContent = selectedCreature.Creature.name;
    document.getElementById('myCreatureType').textContent = selectedCreature.Creature.type.toUpperCase();
    document.getElementById('myCreatureType').className = `creature-type type-${selectedCreature.Creature.type}`;
    document.getElementById('myCreatureLevel').textContent = selectedCreature.level;
    document.getElementById('myCreatureAtk').textContent = selectedCreature.attack;
    document.getElementById('myCreatureDef').textContent = selectedCreature.defense;
    
    const myHpPercent = (selectedCreature.currentHp / selectedCreature.maxHp) * 100;
    document.getElementById('myCreatureHp').style.width = myHpPercent + '%';
    document.getElementById('myCreatureHpText').textContent = 
        `${selectedCreature.currentHp}/${selectedCreature.maxHp}`;
    
    // Enemy
    document.getElementById('enemyCreatureName').textContent = currentEnemy.name;
    document.getElementById('enemyCreatureType').textContent = currentEnemy.type.toUpperCase();
    document.getElementById('enemyCreatureType').className = `creature-type type-${currentEnemy.type}`;
    document.getElementById('enemyCreatureAtk').textContent = currentEnemy.baseAttack;
    document.getElementById('enemyCreatureDef').textContent = currentEnemy.baseDefense;
    
    const enemyHpPercent = (currentEnemy.baseHp / currentEnemyMaxHp) * 100;
    document.getElementById('enemyCreatureHp').style.width = enemyHpPercent + '%';
    document.getElementById('enemyCreatureHpText').textContent = 
        `${currentEnemy.baseHp}/${currentEnemyMaxHp}`;
}

async function attackTurn() {
    if (!battleInProgress) return;
    
    document.getElementById('attackButton').disabled = true;
    
    try {
        const { data } = await axios.post(`${API_URL}/battle/attack`, {
            userCreatureId: selectedCreature.id,
            enemyCreatureId: currentEnemy.id,
            enemyCurrentHp: currentEnemy.baseHp,
            enemyMaxHp: currentEnemyMaxHp,
            isWildBattle: true
        });
        
        // Update logs
        data.battleLog.forEach(log => {
            const logDiv = document.getElementById('battleLog');
            logDiv.innerHTML += `<div class="log-entry">${log}</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        });
        
        // Update HPs
        selectedCreature.currentHp = data.playerHp;
        currentEnemy.baseHp = data.enemyHp;
        
        updateBattleDisplay();
        
        if (data.won) {
            await completeBattle(true);
        } else if (data.lost) {
            await completeBattle(false);
        } else {
            document.getElementById('attackButton').disabled = false;
        }
    } catch (error) {
        console.error('Attack error:', error);
        document.getElementById('attackButton').disabled = false;
    }
}

async function completeBattle(won) {
    try {
        const { data } = await axios.post(`${API_URL}/battle/complete`, {
            userId: currentUser.id,
            userCreatureId: selectedCreature.id,
            won: won,
            enemyName: currentEnemy.name,
            isPvP: false
        });
        
        // Update logs
        const logDiv = document.getElementById('battleLog');
        logDiv.innerHTML += `<div class="log-entry" style="color: ${won ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">${data.message}</div>`;
        
        data.battleLog.forEach(log => {
            logDiv.innerHTML += `<div class="log-entry" style="color: var(--warning);">${log}</div>`;
        });
        
        logDiv.scrollTop = logDiv.scrollHeight;
        
        // Update user data properly
        currentUser.level = data.user.level;
        currentUser.exp = data.user.exp;
        currentUser.money = data.user.money;
        currentUser.wins = data.user.wins;
        currentUser.losses = data.user.losses;
        updatePlayerStats();
        
        // Update creature data
        selectedCreature.currentHp = data.userCreature.hp;
        selectedCreature.maxHp = data.userCreature.maxHp;
        selectedCreature.level = data.userCreature.level;
        selectedCreature.exp = data.userCreature.exp;
        selectedCreature.attack = data.userCreature.attack;
        selectedCreature.defense = data.userCreature.defense;
        
        // Reload creatures to get fresh data from server
        await loadMyCreatures();
        selectCreature(selectedCreature.id);
        
        // Disable battle buttons
        document.getElementById('attackButton').disabled = true;
        document.getElementById('catchButton').disabled = true;
        
        setTimeout(() => {
            endBattle();
        }, 3000);
    } catch (error) {
        console.error('Complete battle error:', error);
    }
}

async function attemptCatch() {
    if (currentUser.pokeballs <= 0) {
        alert('No Pokéballs left! Buy more from the shop.');
        return;
    }
    
    document.getElementById('catchButton').disabled = true;
    
    try {
        const { data } = await axios.post(`${API_URL}/catch`, {
            userId: currentUser.id,
            creatureId: currentEnemy.id,
            currentHp: currentEnemy.baseHp,
            maxHp: currentEnemyMaxHp
        });
        
        currentUser.pokeballs = data.pokeballsLeft;
        updatePlayerStats();
        
        const logDiv = document.getElementById('battleLog');
        logDiv.innerHTML += `<div class="log-entry" style="color: ${data.success ? 'var(--success)' : 'var(--warning)'};">${data.message}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        
        if (data.success) {
            await loadMyCreatures();
            setTimeout(() => {
                endBattle();
            }, 2000);
        } else {
            document.getElementById('catchButton').disabled = false;
        }
    } catch (error) {
        console.error('Catch error:', error);
        document.getElementById('catchButton').disabled = false;
    }
}

async function flee() {
    if (confirm('Are you sure you want to flee? This will count as a loss.')) {
        try {
            const { data } = await axios.post(`${API_URL}/battle/flee`, {
                userId: currentUser.id
            });
            
            // Update user losses from server response
            currentUser.losses = data.user.losses;
            updatePlayerStats();
            
            const logDiv = document.getElementById('battleLog');
            logDiv.innerHTML += '<div class="log-entry" style="color: var(--danger); font-weight: bold;">You fled from battle! (Loss recorded)</div>';
            logDiv.scrollTop = logDiv.scrollHeight;
            
            setTimeout(() => {
                endBattle();
            }, 1500);
        } catch (error) {
            console.error('Flee error:', error);
            alert('Error fleeing battle');
        }
    }
}

function endBattle() {
    battleInProgress = false;
    battleInProgress = false;
    localStorage.removeItem('battle'); 

    document.getElementById('battleSection').classList.add('hidden');
    document.getElementById('huntButton').disabled = false;
    document.getElementById('attackButton').disabled = false;
    document.getElementById('catchButton').disabled = false;
    document.getElementById('huntStatus').textContent = 'Select a creature and hunt again!';
    currentEnemy = null;
}