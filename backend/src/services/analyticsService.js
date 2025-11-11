import Analytics from '../models/Analytics.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

export class AdvancedAnalyticsService {
  
  static async generateUserInsights(userId, period = '30d') {
    const startDate = this.calculateStartDate(period);
    const endDate = new Date();

    const [
      locationPatterns,
      activityTrends,
      engagementMetrics,
      comparisonStats
    ] = await Promise.all([
      this.analyzeLocationPatterns(userId, startDate, endDate),
      this.analyzeActivityTrends(userId, startDate, endDate),
      this.calculateEngagementMetrics(userId, startDate, endDate),
      this.getComparisonStats(userId, period)
    ]);

    return {
      locationPatterns,
      activityTrends,
      engagementMetrics,
      comparisonStats,
      recommendations: this.generateRecommendations({
        locationPatterns,
        activityTrends,
        engagementMetrics
      })
    };
  }

  static async analyzeLocationPatterns(userId, startDate, endDate) {
    const patterns = await Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$createdAt' },
            dayOfWeek: { $dayOfWeek: '$createdAt' }
          },
          count: { $sum: 1 },
          averageAccuracy: { $avg: '$metadata.accuracy' },
          locations: { $push: '$coordinates' }
        }
      },
      {
        $project: {
          hour: '$_id.hour',
          dayOfWeek: '$_id.dayOfWeek',
          count: 1,
          averageAccuracy: 1,
          peak: { $gte: ['$count', 10] } // Consider peak if more than 10 locations in that slot
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Calculate most frequent locations
    const frequentLocations = await this.calculateFrequentLocations(userId, startDate, endDate);
    
    // Calculate movement patterns
    const movementPatterns = await this.analyzeMovementPatterns(userId, startDate, endDate);

    return {
      timeDistribution: patterns,
      frequentLocations,
      movementPatterns,
      peakHours: patterns.filter(p => p.peak).slice(0, 5)
    };
  }

  static async calculateFrequentLocations(userId, startDate, endDate) {
    return Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            lat: { $round: [{ $arrayElemAt: ['$coordinates.coordinates', 1] }, 2] },
            lng: { $round: [{ $arrayElemAt: ['$coordinates.coordinates', 0] }, 2] }
          },
          count: { $sum: 1 },
          lastVisit: { $max: '$createdAt' },
          averageAccuracy: { $avg: '$metadata.accuracy' }
        }
      },
      {
        $project: {
          latitude: '$_id.lat',
          longitude: '$_id.lng',
          count: 1,
          lastVisit: 1,
          averageAccuracy: 1,
          frequency: {
            $divide: ['$count', Math.max(1, (endDate - startDate) / (24 * 60 * 60 * 1000))]
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }

  static async analyzeMovementPatterns(userId, startDate, endDate) {
    const movements = await Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate, $lte: endDate },
          'metadata.speed': { $gt: 1 } // Filter for moving locations (speed > 1 m/s)
        }
      },
      {
        $sort: { createdAt: 1 }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalDistance: { $sum: '$metadata.distance' },
          averageSpeed: { $avg: '$metadata.speed' },
          maxSpeed: { $max: '$metadata.speed' },
          movementTime: {
            $sum: {
              $cond: [{ $gt: ['$metadata.speed', 1] }, 300000, 0] // 5 minutes per moving point
            }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          totalDistance: { $round: ['$totalDistance', 2] },
          averageSpeed: { $round: ['$averageSpeed', 2] },
          maxSpeed: { $round: ['$maxSpeed', 2] },
          movementTime: { $divide: ['$movementTime', 60000] } // Convert to minutes
        }
      },
      { $sort: { date: 1 } }
    ]);

    return movements;
  }

  static async analyzeActivityTrends(userId, startDate, endDate) {
    const trends = await Location.aggregate([
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
          dailyLocations: { $sum: 1 },
          uniqueSessions: { $addToSet: '$session' },
          totalDistance: { $sum: '$metadata.distance' }
        }
      },
      {
        $project: {
          date: '$_id',
          dailyLocations: 1,
          sessionCount: { $size: '$uniqueSessions' },
          totalDistance: 1,
          activityScore: {
            $add: [
              { $multiply: ['$dailyLocations', 0.4] },
              { $multiply: ['$sessionCount', 0.3] },
              { $multiply: [{ $divide: ['$totalDistance', 1000] }, 0.3] }
            ]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Calculate trends
    const activityScores = trends.map(t => t.activityScore);
    const trend = this.calculateTrend(activityScores);

    return {
      dailyTrends: trends,
      overallTrend: trend,
      consistency: this.calculateConsistency(activityScores),
      peakActivity: trends.reduce((max, day) => 
        day.activityScore > max.activityScore ? day : max, trends[0] || {}
      )
    };
  }

  static async calculateEngagementMetrics(userId, startDate, endDate) {
    const [
      sessionStats,
      locationStats,
      karmaProgress
    ] = await Promise.all([
      Session.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            averageDuration: { $avg: '$duration' },
            longestSession: { $max: '$duration' }
          }
        }
      ]),
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
            totalLocations: { $sum: 1 },
            averageAccuracy: { $avg: '$metadata.accuracy' },
            coverageArea: { $stdDevSamp: { $arrayElemAt: ['$coordinates.coordinates', 1] } }
          }
        }
      ]),
      User.findById(userId).select('karma')
    ]);

    return {
      sessions: sessionStats[0] || { totalSessions: 0, averageDuration: 0, longestSession: 0 },
      locations: locationStats[0] || { totalLocations: 0, averageAccuracy: 0, coverageArea: 0 },
      karma: {
        current: karmaProgress?.karma?.points || 0,
        progress: this.calculateKarmaProgress(karmaProgress?.karma?.points || 0)
      },
      engagementScore: this.calculateEngagementScore({
        sessions: sessionStats[0],
        locations: locationStats[0],
        karma: karmaProgress?.karma
      })
    };
  }

  static async getComparisonStats(userId, period) {
    const startDate = this.calculateStartDate(period);
    
    const [userStats, globalStats] = await Promise.all([
      // User stats
      Location.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            userLocations: { $sum: 1 },
            userSessions: { $addToSet: '$session' }
          }
        }
      ]),
      // Global average stats
      Location.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$user',
            locations: { $sum: 1 },
            sessions: { $addToSet: '$session' }
          }
        },
        {
          $group: {
            _id: null,
            avgLocations: { $avg: '$locations' },
            avgSessions: { $avg: { $size: '$sessions' } }
          }
        }
      ])
    ]);

    const userLocationCount = userStats[0]?.userLocations || 0;
    const userSessionCount = userStats[0]?.userSessions?.length || 0;
    const avgLocations = globalStats[0]?.avgLocations || 0;
    const avgSessions = globalStats[0]?.avgSessions || 0;

    return {
      user: {
        locations: userLocationCount,
        sessions: userSessionCount
      },
      average: {
        locations: avgLocations,
        sessions: avgSessions
      },
      comparison: {
        locations: userLocationCount - avgLocations,
        sessions: userSessionCount - avgSessions,
        percentile: this.calculatePercentile(userLocationCount, avgLocations)
      }
    };
  }

  // Helper methods
  static calculateStartDate(period) {
    const now = new Date();
    switch (period) {
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  static calculateTrend(data) {
    if (data.length < 2) return 'stable';
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((avgSecond - avgFirst) / avgFirst) * 100;
    
    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  static calculateConsistency(scores) {
    if (scores.length < 2) return 0;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - average, 2), 0) / scores.length;
    return Math.max(0, 100 - (Math.sqrt(variance) / average) * 100);
  }

  static calculateKarmaProgress(points) {
    const levels = [
      { name: 'bronze', min: 0, max: 100 },
      { name: 'silver', min: 100, max: 500 },
      { name: 'gold', min: 500, max: 1000 },
      { name: 'platinum', min: 1000, max: Infinity }
    ];
    
    const currentLevel = levels.find(level => points >= level.min && points < level.max);
    if (!currentLevel) return { level: 'platinum', progress: 100 };
    
    const progress = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    return { level: currentLevel.name, progress: Math.min(100, progress) };
  }

  static calculateEngagementScore(metrics) {
    let score = 0;
    
    // Session engagement (30%)
    if (metrics.sessions) {
      const sessionScore = Math.min(100, metrics.sessions.totalSessions * 2);
      score += sessionScore * 0.3;
    }
    
    // Location activity (40%)
    if (metrics.locations) {
      const locationScore = Math.min(100, metrics.locations.totalLocations * 0.5);
      score += locationScore * 0.4;
    }
    
    // Karma progress (30%)
    if (metrics.karma) {
      const karmaScore = Math.min(100, metrics.karma.current * 0.1);
      score += karmaScore * 0.3;
    }
    
    return Math.round(score);
  }

  static calculatePercentile(userValue, averageValue) {
    if (userValue === 0 && averageValue === 0) return 50;
    if (averageValue === 0) return 100;
    
    const ratio = userValue / averageValue;
    return Math.min(100, Math.max(0, 50 + (ratio - 1) * 25));
  }

  static generateRecommendations(insights) {
    const recommendations = [];
    
    // Based on location patterns
    if (insights.locationPatterns.peakHours.length === 0) {
      recommendations.push({
        type: 'activity',
        title: 'Start Sharing During Peak Hours',
        description: 'Try sharing locations during typical active hours to increase engagement',
        priority: 'medium'
      });
    }
    
    // Based on engagement
    if (insights.engagementMetrics.engagementScore < 50) {
      recommendations.push({
        type: 'engagement',
        title: 'Increase Your Activity',
        description: 'Share more locations and create sessions to improve your engagement score',
        priority: 'high'
      });
    }
    
    // Based on consistency
    if (insights.activityTrends.consistency < 60) {
      recommendations.push({
        type: 'consistency',
        title: 'Maintain Consistent Activity',
        description: 'Try to share locations regularly to build better location history',
        priority: 'medium'
      });
    }
    
    // Based on comparison
    if (insights.comparisonStats.comparison.locations < 0) {
      recommendations.push({
        type: 'comparison',
        title: 'Catch Up with Community',
        description: `You're ${Math.abs(insights.comparisonStats.comparison.locations)} locations below average`,
        priority: 'low'
      });
    }
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
}