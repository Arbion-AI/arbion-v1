import React from 'react';
import { Play, Pause, Settings, AlertTriangle, MoreVertical } from 'lucide-react';
import { AgentType } from '../../types/agent';

interface AgentCardProps {
  agent: AgentType;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium">{agent.name}</h3>
            {agent.alerts.length > 0 && (
              <div className="ml-2 text-yellow-500">
                <AlertTriangle size={16} />
              </div>
            )}
          </div>
          <p className="text-text-secondary text-xs mt-1">{agent.strategy}</p>
        </div>
        
        <button className="p-1 rounded-lg hover:bg-background-light">
          <MoreVertical size={18} />
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-text-secondary">Status</p>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-1 ${
              agent.status === 'active' ? 'bg-primary status-active' :
              agent.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize">{agent.status}</span>
          </div>
        </div>
        
        <div>
          <p className="text-text-secondary">Model</p>
          <p className="mt-1">{agent.model}</p>
        </div>
        
        <div>
          <p className="text-text-secondary">PnL (24h)</p>
          <p className={`mt-1 ${agent.pnl24h >= 0 ? 'text-primary' : 'text-red-500'}`}>
            {agent.pnl24h >= 0 ? '+' : ''}{agent.pnl24h.toFixed(2)}%
          </p>
        </div>
        
        <div>
          <p className="text-text-secondary">Trades</p>
          <p className="mt-1">{agent.trades}</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">Assets</p>
          <p className="text-text-secondary">Allocation</p>
        </div>
        
        {agent.assets.map((asset, index) => (
          <div key={index} className="flex items-center justify-between mt-2">
            <span>{asset.name}</span>
            <span>{asset.allocation}%</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between">
        {agent.status === 'active' ? (
          <button className="btn btn-outline text-xs flex items-center">
            <Pause size={14} className="mr-1" />
            Pause
          </button>
        ) : (
          <button className="btn btn-primary text-xs flex items-center">
            <Play size={14} className="mr-1" />
            Activate
          </button>
        )}
        
        <button className="btn btn-glass text-xs flex items-center">
          <Settings size={14} className="mr-1" />
          Configure
        </button>
      </div>
    </div>
  );
};

export default AgentCard;