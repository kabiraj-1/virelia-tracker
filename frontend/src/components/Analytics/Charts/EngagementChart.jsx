import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementChart = ({ data }) => {
  // Sample data if none provided
  const chartData = data || [
    { day: 'Mon', engagement: 65 },
    { day: 'Tue', engagement: 78 },
    { day: 'Wed', engagement: 90 },
    { day: 'Thu', engagement: 81 },
    { day: 'Fri', engagement: 56 },
    { day: 'Sat', engagement: 55 },
    { day: 'Sun', engagement: 40 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Engagement %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>User engagement metrics over time</p>
      </div>
    </div>
  );
};

export default EngagementChart;
