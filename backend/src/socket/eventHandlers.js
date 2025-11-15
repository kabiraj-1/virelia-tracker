const socketAuth = require('../middleware/socketAuth');

const configureSocket = (io) => {
  // Authentication middleware for sockets
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    // Join user to their personal room
    socket.join(`user_${socket.user.id}`);

    // Handle event updates
    socket.on('join_event', (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`User ${socket.user.id} joined event ${eventId}`);
    });

    socket.on('leave_event', (eventId) => {
      socket.leave(`event_${eventId}`);
    });

    // Handle real-time chat
    socket.on('send_message', (data) => {
      io.to(`event_${data.eventId}`).emit('new_message', {
        ...data,
        user: socket.user,
        timestamp: new Date()
      });
    });

    // Handle live location updates
    socket.on('update_location', (data) => {
      socket.broadcast.to(`event_${data.eventId}`).emit('user_location_updated', {
        userId: socket.user.id,
        location: data.location,
        user: socket.user
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
    });
  });
};

module.exports = configureSocket;