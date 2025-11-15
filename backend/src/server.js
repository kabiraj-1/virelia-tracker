const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [
      'https://virelia-tracker-frontend-oipev2u8i-kabiraj-1s-projects.vercel.app',
      'https://kabirajbhatt.com.np',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST']
  }
});

// Socket.io handlers
require('./socket/socketHandlers')(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: ${process.env.VITE_API_URL}`);
  console.log(`🌐 Frontend: ${process.env.VITE_APP_NAME}`);
});