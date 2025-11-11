import Location from '../models/Location.js';
import Session from '../models/Session.js';
import { logger } from '../middleware/logger.js';

export const shareLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, sessionId, metadata } = req.body;
    const userId = req.user.id;

    // Create or get session
    let session;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session || session.user.toString() !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
    } else {
      session = new Session({
        user: userId,
        name: `Session ${new Date().toLocaleDateString()}`,
        isActive: true
      });
      await session.save();
    }

    // Create location record
    const location = new Location({
      user: userId,
      session: session._id,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      metadata: {
        accuracy: metadata?.accuracy,
        altitude: metadata?.altitude,
        speed: metadata?.speed,
        timestamp: new Date(),
        ...metadata
      }
    });

    await location.save();

    // Update session's last activity
    session.lastActivity = new Date();
    await session.save();

    logger.info(`Location shared for user ${userId} in session ${session._id}`);

    // Emit real-time update
    req.app.get('io').to(`user_${userId}`).emit('location_update', {
      location: location.toJSON(),
      session: session.toJSON()
    });

    res.status(201).json({
      success: true,
      message: 'Location shared successfully',
      location,
      session
    });
  } catch (error) {
    next(error);
  }
};

export const getLiveLocations = async (req, res, next) => {
  try {
    const { userIds, sessionId } = req.query;
    const currentUser = req.user.id;

    let query = { isActive: true };
    
    if (sessionId) {
      query._id = sessionId;
    }
    
    if (userIds) {
      const userIdArray = Array.isArray(userIds) ? userIds : [userIds];
      query.user = { $in: userIdArray };
    }

    // Get active sessions with recent locations
    const sessions = await Session.find(query)
      .populate('user', 'username profile avatar')
      .populate({
        path: 'locations',
        options: { sort: { createdAt: -1 }, limit: 1 }
      })
      .sort({ lastActivity: -1 });

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        ...session.toJSON(),
        currentLocation: session.locations[0] || null
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getLocationHistory = async (req, res, next) => {
  try {
    const { sessionId, startDate, endDate, limit = 100 } = req.query;
    const userId = req.user.id;

    let query = { user: userId };
    
    if (sessionId) {
      query.session = sessionId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const locations = await Location.find(query)
      .populate('session')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      locations
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const { name, description, isPublic = false } = req.body;
    const userId = req.user.id;

    const session = new Session({
      user: userId,
      name,
      description,
      isPublic,
      isActive: true
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { isActive } = req.query;

    let query = { user: userId };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const sessions = await Session.find(query)
      .populate({
        path: 'locations',
        options: { sort: { createdAt: -1 }, limit: 10 }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    next(error);
  }
};