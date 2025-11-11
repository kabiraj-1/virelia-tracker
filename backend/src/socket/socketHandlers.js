import { logger } from '../utils/logger.js';
import { getRedisClient } from '../config/redis.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Authentication middleware for sockets
    socket.use((packet, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      // Verify token here
      next();
    });

    // Location sharing events
    socket.on('join-location-session', (data) => {
      const { sessionId, userId } = data;
      socket.join(`location:${sessionId}`);
      socket.join(`user:${userId}`);
      
      logger.info(`User ${userId} joined location session: ${sessionId}`);
      
      // Notify others in the session
      socket.to(`location:${sessionId}`).emit('user-joined', {
        userId,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('share-location', async (data) => {
      const { sessionId, location, userId } = data;
      
      // Store location in Redis for real-time access
      try {
        const redisClient = getRedisClient();
        await redisClient.setEx(
          `location:${sessionId}:${userId}`,
          300, // 5 minutes TTL
          JSON.stringify({
            ...location,
            userId,
            timestamp: new Date().toISOString()
          })
        );

        // Broadcast to others in the session
        socket.to(`location:${sessionId}`).emit('location-update', {
          userId,
          location,
          timestamp: new Date().toISOString()
        });

        logger.debug(`Location shared by ${userId} in session ${sessionId}`);
      } catch (error) {
        logger.error('Location sharing error:', error);
      }
    });

    // Chat events
    socket.on('join-chat-room', (data) => {
      const { roomId, userId } = data;
      socket.join(`chat:${roomId}`);
      
      logger.info(`User ${userId} joined chat room: ${roomId}`);
      
      socket.to(`chat:${roomId}`).emit('user-joined-chat', {
        userId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('send-message', (data) => {
      const { roomId, message, userId, userName } = data;
      
      const messageData = {
        id: Date.now().toString(),
        roomId,
        message,
        userId,
        userName,
        timestamp: new Date().toISOString()
      };

      // Broadcast to everyone in the chat room including sender
      io.to(`chat:${roomId}`).emit('new-message', messageData);
      
      logger.info(`Message sent in room ${roomId} by ${userId}`);
    });

    // Video call events
    socket.on('join-call-room', (data) => {
      const { roomId, userId } = data;
      socket.join(`call:${roomId}`);
      
      socket.to(`call:${roomId}`).emit('user-joined-call', {
        userId,
        socketId: socket.id
      });
    });

    socket.on('webrtc-offer', (data) => {
      const { roomId, offer, userId } = data;
      socket.to(`call:${roomId}`).emit('webrtc-offer', {
        offer,
        from: userId
      });
    });

    socket.on('webrtc-answer', (data) => {
      const { roomId, answer, userId } = data;
      socket.to(`call:${roomId}`).emit('webrtc-answer', {
        answer,
        from: userId
      });
    });

    socket.on('webrtc-ice-candidate', (data) => {
      const { roomId, candidate, userId } = data;
      socket.to(`call:${roomId}`).emit('webrtc-ice-candidate', {
        candidate,
        from: userId
      });
    });

    // Presence events
    socket.on('user-online', (data) => {
      const { userId } = data;
      socket.broadcast.emit('user-status-changed', {
        userId,
        isOnline: true,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('user-typing', (data) => {
      const { roomId, userId, isTyping } = data;
      socket.to(`chat:${roomId}`).emit('user-typing', {
        userId,
        isTyping
      });
    });

    // Disconnection handling
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.id}, reason: ${reason}`);
      
      // Notify about user going offline
      socket.broadcast.emit('user-offline', {
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Periodic cleanup of old sessions
  setInterval(async () => {
    try {
      const redisClient = getRedisClient();
      // Cleanup logic for old sessions
      logger.debug('Running session cleanup');
    } catch (error) {
      logger.error('Session cleanup error:', error);
    }
  }, 300000); // Every 5 minutes
};