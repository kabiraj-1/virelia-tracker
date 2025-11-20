import { useState, useEffect } from 'react';
import { karmaService } from '../services/karmaService';

export const useKarma = (userId) => {
  const [karmaHistory, setKarmaHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadKarmaHistory();
    }
    loadLeaderboard();
  }, [userId]);

  const loadKarmaHistory = async () => {
    try {
      const history = await karmaService.getKarmaHistory(userId);
      setKarmaHistory(history);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const leaderboardData = await karmaService.getLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const awardKarma = async (karmaData) => {
    try {
      await karmaService.awardKarma(karmaData);
      await loadLeaderboard(); // Refresh leaderboard
    } catch (err) {
      throw err;
    }
  };

  return {
    karmaHistory,
    leaderboard,
    loading,
    error,
    awardKarma,
    refreshKarma: loadKarmaHistory,
    refreshLeaderboard: loadLeaderboard
  };
};