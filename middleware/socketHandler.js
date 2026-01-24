function websocketHandling(io){
    const { User } = require('../models');

const onlineUsers = new Map(); // userId -> socketId
const activeChallenges = new Map(); // challengeId -> { challenger, challenged, status }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User goes online
  socket.on('user:online', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit('users:update', Array.from(onlineUsers.keys()));
    console.log(`User ${userId} is online`);
  });

  // Global chat
  socket.on('chat:message', async (data) => {
    try {
      const user = await User.findByPk(data.userId);
      if (user) {
        io.emit('chat:message', {
          username: user.username,
          message: data.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  });

  // PvP Challenge
  socket.on('challenge:send', async (data) => {
    try {
      const challenger = await User.findByPk(data.challengerId);
      const challenged = await User.findByPk(data.challengedId);
      
      if (challenger && challenged) {
        const challengeId = `${data.challengerId}-${data.challengedId}-${Date.now()}`;
        activeChallenges.set(challengeId, {
          challengerId: data.challengerId,
          challengerName: challenger.username,
          challengedId: data.challengedId,
          challengedName: challenged.username,
          status: 'pending'
        });

        const targetSocket = onlineUsers.get(data.challengedId);
        if (targetSocket) {
          io.to(targetSocket).emit('challenge:received', {
            challengeId,
            challengerName: challenger.username,
            challengerId: data.challengerId
          });
        }
      }
    } catch (error) {
      console.error('Challenge error:', error);
    }
  });

  // Accept/Decline Challenge
  socket.on('challenge:response', (data) => {
    const challenge = activeChallenges.get(data.challengeId);
    if (challenge) {
      const challengerSocket = onlineUsers.get(challenge.challengerId);
      
      if (data.accepted) {
        challenge.status = 'active';
        activeChallenges.set(data.challengeId, challenge);
        
        if (challengerSocket) {
          io.to(challengerSocket).emit('challenge:accepted', {
            challengeId: data.challengeId,
            opponentId: challenge.challengedId,
            opponentName: challenge.challengedName
          });
        }
        
        socket.emit('challenge:start', {
          challengeId: data.challengeId,
          opponentId: challenge.challengerId,
          opponentName: challenge.challengerName
        });
      } else {
        activeChallenges.delete(data.challengeId);
        if (challengerSocket) {
          io.to(challengerSocket).emit('challenge:declined', {
            challengedName: challenge.challengedName
          });
        }
      }
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('users:update', Array.from(onlineUsers.keys()));
      
      try {
        const user = await User.findByPk(socket.userId);
        if (user) {
          await user.update({ isOnline: false });
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
    console.log('User disconnected:', socket.id);
  });
});
}


module.exports  = websocketHandling