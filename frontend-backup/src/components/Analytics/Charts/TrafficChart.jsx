import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const TrafficChart = ({ data = [] }) => {
  const formatTooltip = (value, name) => {
    switch (name) {
      case 'locations':
        return [value.toLocaleString(), 'Locations Shared'];
      case 'sessions':
        return [value, 'Active Sessions'];
      case 'distance':
        return [`${(value / 1000).toFixed(1)} km`, 'Distance Traveled'];
      default:
        return [value, name];
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Location Traffic
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              contentStyle={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="locations" 
              stroke="#4FD1C5" 
              strokeWidth={2}
              dot={{ fill: '#4FD1C5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#38B2AC' }}
              name="Locations Shared"
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#805AD5" 
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={{ fill: '#805AD5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#6B46C1' }}
              name="Active Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Track your location sharing activity over time</p>
      </div>
    </div>
  );
};

export default TrafficChart;