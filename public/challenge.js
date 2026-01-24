       // ============ CHALLENGE ============
       function challengePlayer(opponentId, opponentName) {
        if (!selectedCreature || selectedCreature.currentHp <= 0) {
            alert('Select a healthy creature first!');
            return;
        }
        
        socket.emit('challenge:send', {
            challengerId: currentUser.id,
            challengedId: opponentId
        });
        
        alert(`Challenge sent to ${opponentName}!`);
    }

    function acceptChallenge() {
        if (pendingChallenge) {
            socket.emit('challenge:response', {
                challengeId: pendingChallenge.challengeId,
                accepted: true
            });
            document.getElementById('challengeModal').classList.remove('active');
            alert('Challenge accepted! (PvP battles coming soon)');
            pendingChallenge = null;
        }
    }

    function declineChallenge() {
        if (pendingChallenge) {
            socket.emit('challenge:response', {
                challengeId: pendingChallenge.challengeId,
                accepted: false
            });
            document.getElementById('challengeModal').classList.remove('active');
            pendingChallenge = null;
        }
    }
