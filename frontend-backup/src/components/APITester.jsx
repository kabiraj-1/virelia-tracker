import React, { useState } from 'react';
import ApiService from '../services/api';

const APITester = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    const endpoints = [
      { name: 'Health', method: ApiService.healthCheck },
      { name: 'Dashboard', method: ApiService.getDashboardData },
      { name: 'Karma Metrics', method: ApiService.getKarmaMetrics },
      { name: 'Leaderboard', method: ApiService.getLeaderboard },
    ];

    const results = {};
    for (const endpoint of endpoints) {
      try {
        const data = await endpoint.method();
        results[endpoint.name] = { success: true, data };
      } catch (error) {
        results[endpoint.name] = { success: false, error: error.message };
      }
    }
    
    setResults(results);
    setTesting(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      <button
        onClick={testEndpoints}
        disabled={testing}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test All Endpoints'}
      </button>
      
      <div className="mt-4 space-y-2">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className={`p-3 rounded ${
            result.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
          }`}>
            <strong>{name}:</strong> {result.success ? '✅ Connected' : '❌ Failed'}
            {result.success && (
              <div className="text-sm text-gray-600 mt-1">
                Response: {JSON.stringify(result.data).substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APITester;
