import React from 'react';
import { Database, ArrowUpRight, Upload } from 'lucide-react';
import ModelCard from '../components/models/ModelCard';

const Models: React.FC = () => {
  const models = [
    {
      id: '1',
      name: 'BTC-ETH Price Predictor',
      type: 'Regression',
      lastUpdated: '2025-03-15',
      accuracy: 0.87,
      status: 'active',
      description: 'Predicts price movements between BTC and ETH based on historical data and market indicators.'
    },
    {
      id: '2',
      name: 'Market Sentiment Analyzer',
      type: 'NLP',
      lastUpdated: '2025-03-10',
      accuracy: 0.92,
      status: 'active',
      description: 'Analyzes social media and news sentiment to predict market movements.'
    },
    {
      id: '3',
      name: 'Volatility Forecaster',
      type: 'Time Series',
      lastUpdated: '2025-03-05',
      accuracy: 0.78,
      status: 'training',
      description: 'Forecasts market volatility to optimize entry and exit points.'
    },
    {
      id: '4',
      name: 'Pattern Recognition',
      type: 'Computer Vision',
      lastUpdated: '2025-02-27',
      accuracy: 0.81,
      status: 'active',
      description: 'Identifies chart patterns and technical indicators for trading signals.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Model Hub</h1>
        <button className="btn btn-primary flex items-center">
          <Upload size={18} className="mr-2" />
          Upload Model
        </button>
      </div>

      <div className="glass-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-medium">AI Models</h2>
            <p className="text-text-secondary text-sm">Browse and manage your AI/ML models for trading strategies</p>
          </div>
        </div>
        
        {/* Model usage stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card">
            <p className="text-text-secondary text-sm">Total Models</p>
            <h3 className="text-2xl font-bold">{models.length}</h3>
          </div>
          
          <div className="glass-card">
            <p className="text-text-secondary text-sm">Inference Requests (24h)</p>
            <h3 className="text-2xl font-bold">2,347</h3>
            <div className="flex items-center mt-2 text-xs text-primary">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+18% from yesterday</span>
            </div>
          </div>
          
          <div className="glass-card">
            <p className="text-text-secondary text-sm">Avg. Inference Time</p>
            <h3 className="text-2xl font-bold">124ms</h3>
          </div>
        </div>
        
        {/* Models grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Models;