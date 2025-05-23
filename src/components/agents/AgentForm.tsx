import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAgentContext } from '../../contexts/AgentContext';

interface AgentFormProps {
  onClose: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ onClose }) => {
  const { createAgent } = useAgentContext();
  
  const [formData, setFormData] = useState({
    name: '',
    strategy: 'arbitrage',
    model: 'market-predictor-v1',
    assets: [
      { name: 'ETH', allocation: 50 },
      { name: 'BTC', allocation: 50 }
    ],
    maxTradeSize: 100,
    slippage: 0.5,
    gasPrice: 'standard'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAgent({
      ...formData,
      id: `agent-${Date.now()}`,
      status: 'paused',
      pnl24h: 0,
      trades: 0,
      alerts: []
    });
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button 
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-background-light"
      >
        <X size={20} />
      </button>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agent Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., ETH-BTC Arbitrage Bot"
              className="glass-input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Strategy Type</label>
            <select 
              name="strategy" 
              value={formData.strategy}
              onChange={handleChange}
              className="glass-input w-full"
            >
              <option value="arbitrage">Arbitrage</option>
              <option value="momentum">Momentum Trading</option>
              <option value="mean-reversion">Mean Reversion</option>
              <option value="grid-trading">Grid Trading</option>
              <option value="custom">Custom Strategy</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">AI Model</label>
            <select 
              name="model" 
              value={formData.model}
              onChange={handleChange}
              className="glass-input w-full"
            >
              <option value="market-predictor-v1">Market Predictor v1</option>
              <option value="sentiment-analyzer">Sentiment Analyzer</option>
              <option value="pattern-recognition">Pattern Recognition</option>
              <option value="volatility-predictor">Volatility Predictor</option>
            </select>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Risk Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Max Trade Size (USD)</label>
              <input
                type="number"
                name="maxTradeSize"
                value={formData.maxTradeSize}
                onChange={handleChange}
                min={1}
                max={10000}
                className="glass-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Slippage Tolerance (%)</label>
              <input
                type="number"
                name="slippage"
                value={formData.slippage}
                onChange={handleChange}
                min={0.1}
                max={5}
                step={0.1}
                className="glass-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Gas Price</label>
              <select 
                name="gasPrice" 
                value={formData.gasPrice}
                onChange={handleChange}
                className="glass-input w-full"
              >
                <option value="slow">Slow (Low Cost)</option>
                <option value="standard">Standard</option>
                <option value="fast">Fast (Priority)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-glass"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Create Agent
          </button>
        </div>
      </div>
    </form>
  );
};

export default AgentForm;