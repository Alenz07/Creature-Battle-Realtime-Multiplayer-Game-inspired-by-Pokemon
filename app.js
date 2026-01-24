const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { sequelize, User } = require('./models');
const routes = require('./routes');
const seedCreatures = require('./seed');
const socketHandler = require("./middleware/socketHandler")

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
socketHandler(io)


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


const PORT = process.env.PORT || 3000;

// Database sync and server start
sequelize.sync({ force: true }).then(async () => {
  console.log('✅ Database synced!');
  await seedCreatures();
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ Database sync error:', error);
});

