async function checkAutoLogin() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (token && userId) {
    try {
      const res = await axios.post(`${API_URL}/verify`, 
        { userId },
        {
          headers: { 
            'Authorization': `${token}`
          }
        }
      );
      
      currentUser = res.data.user;
      
      // Check for abandoned battle and record as loss
      if (localStorage.getItem('battle') === 'true') {
        await axios.post(`${API_URL}/battle/flee`, { userId: currentUser.id });
        localStorage.removeItem('battle');
      }
      
      document.getElementById('loginScreen').classList.remove('active');
      document.getElementById('gameScreen').classList.add('active');
      socket.emit('user:online', currentUser.id);
      initGame();
      
    } catch (error) {
      console.error('Auto-login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }
}
  
  // Call it when page loads
  window.addEventListener('DOMContentLoaded', checkAutoLogin);

let currentUser = null;
let myCreatures = [];
let selectedCreature = null;
let currentEnemy = null;
let currentEnemyMaxHp = 100;
let battleInProgress = false;
let onlineUsers = [];
let pendingChallenge = null;

const API_URL = 'http://localhost:3000/api';

// ----------------------INITIALIZING GAME----------------------------
async function initGame() {
    updatePlayerStats();
    await loadMyCreatures();
    showHunt();
}

function updatePlayerStats() {
    document.getElementById('playerName').textContent = currentUser.username;
    document.getElementById('playerLevel').textContent = currentUser.level;
    document.getElementById('playerExp').textContent = currentUser.exp;
    document.getElementById('playerMoney').textContent = currentUser.money;
    document.getElementById('playerBalls').textContent = currentUser.pokeballs;
    document.getElementById('playerWins').textContent = currentUser.wins;
    document.getElementById('playerLosses').textContent = currentUser.losses;
    
    const total = currentUser.wins + currentUser.losses;
    const winRate = total > 0 ? ((currentUser.wins / total) * 100).toFixed(1) : 0;
    document.getElementById('playerWinRate').textContent = winRate + '%';
    
    // Update nav
    document.getElementById('navMoney').textContent = currentUser.money;
    document.getElementById('navBalls').textContent = currentUser.pokeballs;
    document.getElementById('navLevel').textContent = currentUser.level;
}

// ============ NAVIGATION ============
function hideAllViews() {
    document.getElementById('huntView').classList.add('hidden');
    document.getElementById('creaturesView').classList.add('hidden');
    document.getElementById('shopView').classList.add('hidden');
    document.getElementById('leaderboardView').classList.add('hidden');
    document.getElementById('chatView').classList.add('hidden');
}

function showHunt() {
    hideAllViews();
    document.getElementById('huntView').classList.remove('hidden');
}

function showMyCreatures() {
    hideAllViews();
    document.getElementById('creaturesView').classList.remove('hidden');
    loadMyCreatures();
}

function showShop() {
    hideAllViews();
    document.getElementById('shopView').classList.remove('hidden');
}

function showLeaderboard() {
    hideAllViews();
    document.getElementById('leaderboardView').classList.remove('hidden');
    loadLeaderboard();
}

function showChat() {
    hideAllViews();
    document.getElementById('chatView').classList.remove('hidden');
}





