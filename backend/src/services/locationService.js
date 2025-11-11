import Location from '../models/Location.js';
import Session from '../models/Session.js';

export class LocationService {
  static async calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return distance;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static async getNearbyUsers(userId, latitude, longitude, radiusKm = 10) {
    const locations = await Location.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distance',
          maxDistance: radiusKm * 1000, // Convert to meters
          spherical: true,
          query: {
            user: { $ne: userId },
            createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
          }
        }
      },
      {
        $group: {
          _id: '$user',
          latestLocation: { $first: '$$ROOT' },
          distance: { $first: '$distance' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0,
          'user.email': 0
        }
      }
    ]);

    return locations;
  }

  static async generateHeatmapData(userId, startDate, endDate) {
    const locations = await Location.find({
      user: userId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).select('coordinates metadata createdAt');

    // Group by area and count frequency
    const heatmapData = locations.reduce((acc, location) => {
      const lat = location.coordinates.coordinates[1].toFixed(2);
      const lng = location.coordinates.coordinates[0].toFixed(2);
      const key = `${lat},${lng}`;
      
      acc[key] = acc[key] || { lat: parseFloat(lat), lng: parseFloat(lng), count: 0 };
      acc[key].count++;
      
      return acc;
    }, {});

    return Object.values(heatmapData);
  }

  static async calculateStats(userId, period = '7d') {
    const startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const stats = await Location.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalLocations: { $sum: 1 },
          uniqueDays: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
          averageAccuracy: { $avg: '$metadata.accuracy' },
          totalDistance: { $sum: '$metadata.distance' }
        }
      },
      {
        $project: {
          totalLocations: 1,
          uniqueDays: { $size: '$uniqueDays' },
          averageAccuracy: 1,
          totalDistance: 1
        }
      }
    ]);

    return stats[0] || {
      totalLocations: 0,
      uniqueDays: 0,
      averageAccuracy: 0,
      totalDistance: 0
    };
  }
}