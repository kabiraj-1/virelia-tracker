import { logger } from '../middleware/logger.js';

export const initializeCallHandlers = (io, socket) => {
  
  // Join video call room
  socket.on('join_video_call', async (data) => {
    try {
      const { roomId } = data;
      
      // Join the room
      socket.join(roomId);
      
      // Notify others in the room
      socket.to(roomId).emit('user_joined_call', {
        userId: socket.userId,
        username: socket.username,
        roomId
      });

      logger.info(`User ${socket.username} joined video call room ${roomId}`);
    } catch (error) {
      logger.error('Error joining video call:', error);
      socket.emit('call_error', { message: 'Failed to join call' });
    }
  });

  // Leave video call room
  socket.on('leave_video_call', (data) => {
    const { roomId } = data;
    
    socket.leave(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user_left_call', {
      userId: socket.userId,
      username: socket.username,
      roomId
    });

    logger.info(`User ${socket.username} left video call room ${roomId}`);
  });

  // WebRTC signaling: Offer
  socket.on('offer', (data) => {
    const { roomId, targetUserId, offer } = data;
    
    socket.to(targetUserId).emit('offer', {
      userId: socket.userId,
      username: socket.username,
      offer,
      roomId
    });
  });

  // WebRTC signaling: Answer
  socket.on('answer', (data) => {
    const { roomId, targetUserId, answer } = data;
    
    socket.to(targetUserId).emit('answer', {
      userId: socket.userId,
      username: socket.username,
      answer,
      roomId
    });
  });

  // WebRTC signaling: ICE Candidate
  socket.on('ice_candidate', (data) => {
    const { roomId, targetUserId, candidate } = data;
    
    socket.to(targetUserId).emit('ice_candidate', {
      userId: socket.userId,
      username: socket.username,
      candidate,
      roomId
    });
  });

  // Start voice call
  socket.on('start_voice_call', (data) => {
    const { roomId, targetUserIds } = data;
    
    // Notify target users about incoming call
    targetUserIds.forEach(userId => {
      socket.to(userId).emit('incoming_voice_call', {
        roomId,
        callerId: socket.userId,
        callerName: socket.username
      });
    });

    logger.info(`Voice call initiated by ${socket.username} in room ${roomId}`);
  });

  // Accept voice call
  socket.on('accept_voice_call', (data) => {
    const { roomId } = data;
    
    socket.join(roomId);
    socket.to(roomId).emit('voice_call_accepted', {
      userId: socket.userId,
      username: socket.username
    });
  });

  // Reject voice call
  socket.on('reject_voice_call', (data) => {
    const { roomId, callerId } = data;
    
    socket.to(callerId).emit('voice_call_rejected', {
      userId: socket.userId,
      username: socket.username
    });
  });

  // End voice call
  socket.on('end_voice_call', (data) => {
    const { roomId } = data;
    
    socket.to(roomId).emit('voice_call_ended', {
      userId: socket.userId,
      username: socket.username
    });
    
    socket.leave(roomId);
  });

  // Handle call timeouts
  socket.on('call_timeout', (data) => {
    const { roomId, targetUserIds } = data;
    
    targetUserIds.forEach(userId => {
      socket.to(userId).emit('call_timeout', {
        roomId,
        callerId: socket.userId
      });
    });
  });
};

export const cleanupCallHandlers = (socket) => {
  // Clean up any call-related data when socket disconnects
  const rooms = Array.from(socket.rooms);
  
  rooms.forEach(room => {
    if (room !== socket.id) {
      socket.to(room).emit('user_left_call', {
        userId: socket.userId,
        username: socket.username
      });
    }
  });
};