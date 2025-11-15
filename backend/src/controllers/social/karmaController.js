const Karma = require('../../models/social/Karma');
const User = require('../User');

class KarmaController {
  async getLeaderboard(req, res) {
    try {
      const leaderboard = await User.aggregate([
        {
          $lookup: {
            from: 'karma',
            localField: '_id',
            foreignField: 'userId',
            as: 'karmaHistory'
          }
        },
        {
          $addFields: {
            totalKarma: { $sum: '$karmaHistory.points' }
          }
        },
        { $sort: { totalKarma: -1 } },
        { $limit: 50 },
        {
          $project: {
            name: 1,
            email: 1,
            totalKarma: 1,
            avatar: 1
          }
        }
      ]);
      
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserKarma(req, res) {
    try {
      const karmaHistory = await Karma.find({ userId: req.params.userId })
        .sort({ createdAt: -1 })
        .limit(20);
      
      const totalKarma = await Karma.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: null, total: { $sum: '$points' } } }
      ]);

      res.json({ 
        success: true, 
        data: {
          history: karmaHistory,
          total: totalKarma[0]?.total || 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new KarmaController();
