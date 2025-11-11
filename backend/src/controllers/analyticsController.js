import Analytics from '../models/Analytics.js';
import Location from '../models/Location.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { logger } from '../middleware/logger.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const { range = '7d' } = req.query;
    const userId = req.user.id;

    // Calculate date range
    const startDate = calculateStartDate(range);
    const endDate = new Date();

    // Get overview stats
    const overview = await getOverviewStats(userId, startDate, endDate);
    
    // Get traffic data
    const traffic = await getTrafficData(userId, startDate, endDate);
    
    // Get engagement data
    const engagement = await getEngagementData(userId, startDate, endDate);
    
    // Get geographic data
    const geographic = await getGeographicData(userId, startDate, endDate);
    
    // Get karma metrics
    const karma = await getKarmaMetrics(userId);
    
    // Get performance metrics
    const performance = await getPerformanceMetrics(userId, startDate, endDate);

    res.json({
      success: true,
      data: {
        overview,
        traffic,
        engagement,
        geographic,
        karma,
        performance
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOverviewStats = async (userId, startDate, endDate) => {
  const [
    totalLocations,
    activeSessions,
    totalDistance,
    averageAccuracy,
    locationStats,
    sessionStats
  ] = await Promise.all([
    // Total locations shared
    Location.countDocuments({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }),

    // Active sessions
    Session.countDocuments({
      user: userId,
      isActive: true,
      lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }),

    // Total distance (approximate)
    Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalDistance: { $sum: '$metadata.distance' }
        }
      }
    ]),

    // Average accuracy
    Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate },
          'metadata.accuracy': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          averageAccuracy: { $avg: '$metadata.accuracy' }
        }
      }
    ]),

    // Location stats by day
    Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    // Session stats
    Session.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  return {
    totalLocations,
    activeSessions,
    totalDistance: totalDistance[0]?.totalDistance || 0,
    averageAccuracy: averageAccuracy[0]?.averageAccuracy || 0,
    locationStats: locationStats,
    sessionStats: sessionStats
  };
};

export const getTrafficData = async (userId, startDate, endDate) => {
  const trafficData = await Location.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        locations: { $sum: 1 },
        sessions: {
          $addToSet: '$session'
        },
        distance: { $sum: '$metadata.distance' }
      }
    },
    {
      $project: {
        date: '$_id',
        locations: 1,
        sessions: { $size: '$sessions' },
        distance: 1
      }
    },
    { $sort: { date: 1 } }
  ]);

  return trafficData;
};

export const getKarmaMetrics = async (userId) => {
  const user = await User.findById(userId).select('karma');
  
  if (!user) {
    return {
      points: 0,
      level: 'bronze',
      rank: 0,
      progress: 0,
      nextLevel: 'silver',
      achievements: []
    };
  }

  // Calculate rank (simplified)
  const usersWithHigherKarma = await User.countDocuments({
    'karma.points': { $gt: user.karma.points }
  });

  const rank = usersWithHigherKarma + 1;

  // Calculate progress to next level
  const levelRequirements = {
    bronze: 0,
    silver: 100,
    gold: 500,
    platinum: 1000
  };

  const currentLevelPoints = levelRequirements[user.karma.level];
  const nextLevel = getNextLevel(user.karma.level);
  const nextLevelPoints = levelRequirements[nextLevel];
  const progress = nextLevelPoints > 0 
    ? Math.min(100, ((user.karma.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100)
    : 0;

  // Mock achievements (in real app, these would come from a separate collection)
  const achievements = [
    { name: 'First Location Shared', points: 10, unlocked: true },
    { name: 'Daily User', points: 25, unlocked: user.karma.points >= 25 },
    { name: 'Explorer', points: 50, unlocked: user.karma.points >= 50 },
    { name: 'Location Master', points: 100, unlocked: user.karma.points >= 100 }
  ].filter(ach => ach.unlocked);

  return {
    points: user.karma.points,
    level: user.karma.level,
    rank,
    progress: Math.round(progress),
    nextLevel,
    achievements
  };
};

// Helper functions
const calculateStartDate = (range) => {
  const now = new Date();
  switch (range) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
};

const getNextLevel = (currentLevel) => {
  const levels = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = levels.indexOf(currentLevel);
  return levels[Math.min(currentIndex + 1, levels.length - 1)];
};

const getEngagementData = async (userId, startDate, endDate) => {
  // Implementation for engagement metrics
  return [];
};

const getGeographicData = async (userId, startDate, endDate) => {
  // Implementation for geographic distribution
  return [];
};

const getPerformanceMetrics = async (userId, startDate, endDate) => {
  // Implementation for performance metrics
  return {};
};