

const socket = io('http://localhost:3000');
        

// ============ WEBSOCKET ============
socket.on('connect', () => {
    console.log('Connected to server');
    if (currentUser) {
        socket.emit('user:online', currentUser.id);
    }
});

socket.on('users:update', (users) => {
    onlineUsers = users;
    if (document.getElementById('leaderboardView').classList.contains('hidden') === false) {
        showLeaderboard();
    }
});

socket.on('chat:message', (data) => {
    addChatMessage(data.username, data.message);
});

socket.on('challenge:received', (data) => {
    pendingChallenge = data;
    document.getElementById('challengeText').textContent = 
        `${data.challengerName} challenges you to battle!`;
    document.getElementById('challengeModal').classList.add('active');
});

socket.on('challenge:accepted', (data) => {
    alert(`${data.opponentName} accepted your challenge! (PvP battles coming soon)`);
});

socket.on('challenge:declined', (data) => {
    alert(`${data.challengedName} declined your challenge.`);
});
