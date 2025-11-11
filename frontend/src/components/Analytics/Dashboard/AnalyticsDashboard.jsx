import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import StatsOverview from './StatsOverview';
import TrafficChart from '../Charts/TrafficChart';
import EngagementChart from '../Charts/EngagementChart';
import GeographicChart from '../Charts/GeographicChart';
import KarmaMetrics from '../Metrics/KarmaMetrics';
import PerformanceMetrics from '../Metrics/PerformanceMetrics';
import QuickActions from './QuickActions';
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    traffic: [],
    engagement: [],
    geographic: [],
    performance: {}
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format = 'csv') => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `virelia-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your location sharing activity and engagement metrics
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={() => exportData('csv')}
            className="flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsOverview data={analyticsData.overview} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart data={analyticsData.traffic} />
        <EngagementChart data={analyticsData.engagement} />
        <GeographicChart data={analyticsData.geographic} />
        <KarmaMetrics data={analyticsData.karma} />
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics data={analyticsData.performance} />
    </div>
  );
};

export default AnalyticsDashboard;