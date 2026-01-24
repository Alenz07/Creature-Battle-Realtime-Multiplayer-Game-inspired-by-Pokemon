// ============ LEADERBOARD ============
async function loadLeaderboard() {
    try {
        const { data } = await axios.get(`${API_URL}/leaderboard`);
        
        const tbody = document.getElementById('leaderboardBody');
        tbody.innerHTML = data.leaderboard.map((player, index) => {
           
            const isOnline = onlineUsers.includes(player.userId) || player.isOnline;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const isCurrentUser = currentUser.username === player.username;
            
            return `
                <tr style="${isCurrentUser ? 'background: rgba(91, 127, 255, 0.1);' : ''}">
                    <td class="${rankClass}">${index + 1}</td>
                    <td>
                        ${isOnline ? '<span class="online-indicator"></span>' : ''}
                        ${player.username}
                        ${isCurrentUser ? ' (You)' : ''}
                    </td>
                    <td>${player.level}</td>
                    <td>${player.wins}W - ${player.losses}L</td>
                    <td>${player.winRate}</td>
                    <td>
                        ${!isCurrentUser && isOnline && selectedCreature && selectedCreature.currentHp > 0 ? 
                            `<button class="challenge-btn warning" onclick="challengePlayer(${player.userId}, '${player.username}')">⚔️ Challenge</button>` : 
                            '-'}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Leaderboard error:', error);
    }
}