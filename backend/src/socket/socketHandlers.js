// Socket.io event handlers
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join user to their room
    socket.on('joinUser', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
    
    // Location tracking
    socket.on('locationUpdate', (data) => {
      console.log('Location update:', data);
      socket.broadcast.emit('locationChanged', {
        userId: data.userId,
        location: data.location,
        timestamp: new Date().toISOString()
      });
    });
    
    // Chat messages
    socket.on('sendMessage', (data) => {
      console.log('New message:', data);
      io.to(data.roomId).emit('newMessage', {
        id: Date.now(),
        user: data.user,
        message: data.message,
        timestamp: new Date().toISOString()
      });
    });
    
    // Video call signaling
    socket.on('callUser', (data) => {
      socket.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    });
    
    socket.on('answerCall', (data) => {
      socket.to(data.to).emit('callAccepted', data.signal);
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
