import ChatMessage from '../models/ChatMessage.js';
import ChatRoom from '../models/ChatRoom.js';
import { logger } from '../middleware/logger.js';

export const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;

    let query = { room: roomId };
    
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await ChatMessage.find(query)
      .populate('user', 'username profile avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Reverse to show oldest first at the bottom
    const sortedMessages = messages.reverse();

    res.json({
      success: true,
      messages: sortedMessages,
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { roomId, content, type = 'text', replyTo } = req.body;
    const userId = req.user.id;

    // Verify user has access to room
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat room'
      });
    }

    // Create message
    const message = new ChatMessage({
      room: roomId,
      user: userId,
      content,
      type,
      replyTo
    });

    await message.save();

    // Populate user data for real-time emission
    await message.populate('user', 'username profile avatar');

    // Emit to room
    req.app.get('io').to(roomId).emit('message_received', message);

    logger.info(`Message sent in room ${roomId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { name, description, participants, isGroup = false } = req.body;
    const userId = req.user.id;

    // Ensure participants array includes the creator
    const allParticipants = [...new Set([userId, ...participants])];

    const room = new ChatRoom({
      name,
      description,
      participants: allParticipants,
      isGroup,
      createdBy: userId
    });

    await room.save();

    // Populate participant data
    await room.populate('participants', 'username profile avatar');

    res.status(201).json({
      success: true,
      message: 'Chat room created successfully',
      room
    });
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rooms = await ChatRoom.find({
      participants: userId
    })
    .populate('participants', 'username profile avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Mark all unread messages in this room as read
    await ChatMessage.updateMany(
      {
        room: roomId,
        user: { $ne: userId },
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId }
      }
    );

    // Emit read receipt
    req.app.get('io').to(roomId).emit('messages_read', {
      userId,
      roomId,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};