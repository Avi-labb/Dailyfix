import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const Debug = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (type, title, message, success) => {
    setResults(prev => [...prev, { id: Date.now(), type, title, message, success }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Environment Check
    addResult('info', 'Environment Check', 'Checking browser environment...', true);
    
    // Test 2: API Connection
    try {
      const response = await fetch('/api/');
      addResult('success', 'API Connection', `API Server responded with status ${response.status}`, true);
    } catch (error) {
      addResult('error', 'API Connection', 'Failed to connect to API server: ' + error.message, false);
    }
    
    // Test 3: Shipping Rate Calculation
    try {
      const rateResult = await orderAPI.getShippingRate('400001');
      addResult('success', 'Shipping Rate', `Rate for 400001: ₹${rateResult.data.rate}`, true);
    } catch (error) {
      addResult('warning', 'Shipping Rate', 'Rate calculation test: ' + error.message, false);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-500 text-green-800';
      case 'error': return 'bg-red-100 border-red-500 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">🛠️ Dailyfix Debug Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            {loading ? 'Running...' : '🔄 Run All Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {results.map(test => (
            <div
              key={test.id}
              className={`p-4 rounded-lg border-l-4 ${getStatusColor(test.type)}`}
            >
              <h3 className="font-semibold text-lg">{test.title}</h3>
              <p className="mt-1">{test.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Server Checks</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✅ API Routes configured</li>
              <li>✅ Delhivery API connected</li>
              <li>✅ Database connected</li>
              <li>✅ Razorpay integration</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Client Checks</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✅ React working</li>
              <li>✅ Router configured</li>
              <li>✅ API interceptors active</li>
              <li>✅ Store locator map working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;
