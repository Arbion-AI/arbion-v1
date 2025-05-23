import React, { useState } from 'react';
import { ChevronDown, RefreshCw, Calendar } from 'lucide-react';

const MetricsPanel: React.FC = () => {
  const [timeframe, setTimeframe] = useState('24h');
  
  // Placeholder chart component - in a real app this would use a chart library
  const ProfitLossChart = () => (
    <div className="mt-4 h-64 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full flex flex-col">
          <div className="h-1/3 border-b border-dashed border-border"></div>
          <div className="h-1/3 border-b border-dashed border-border"></div>
          <div className="h-1/3"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
          No data available
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="glass-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-lg font-medium">Performance Metrics</h2>
        
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button className="glass-input text-xs flex items-center">
            <Calendar size={14} className="mr-1" />
            {timeframe}
            <ChevronDown size={14} className="ml-1" />
          </button>
          
          <button className="glass-input p-1">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="glass-card">
          <p className="text-text-secondary text-xs">Net Profit/Loss</p>
          <h3 className="text-xl font-bold">$0.00</h3>
          <p className="text-text-secondary text-xs mt-1">0.0% from initial</p>
        </div>
        
        <div className="glass-card">
          <p className="text-text-secondary text-xs">Win/Loss Ratio</p>
          <h3 className="text-xl font-bold">0.00</h3>
          <p className="text-text-secondary text-xs mt-1">0 wins / 0 losses</p>
        </div>
        
        <div className="glass-card">
          <p className="text-text-secondary text-xs">Avg. Hold Time</p>
          <h3 className="text-xl font-bold">0m 0s</h3>
          <p className="text-text-secondary text-xs mt-1">No change</p>
        </div>
      </div>
      
      <ProfitLossChart />
      
      <div className="flex justify-center mt-4">
        <div className="flex items-center text-xs space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
            <span>Profit</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Loss</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Gas Costs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;