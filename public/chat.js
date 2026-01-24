        // ============ CHAT ============
        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            
            if (message && currentUser) {
                socket.emit('chat:message', {
                    userId: currentUser.id,
                    message: message
                });
                input.value = '';
            }
        }

        function addChatMessage(username, message) {
            const chatDiv = document.getElementById('chatMessages');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message';
            msgDiv.innerHTML = `<span class="chat-username">${username}:</span><span class="chat-text">${message}</span>`;
            chatDiv.appendChild(msgDiv);
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
