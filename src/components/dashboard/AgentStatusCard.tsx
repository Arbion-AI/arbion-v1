import React from 'react';
import { Play, Pause, Settings, AlertTriangle } from 'lucide-react';
import { AgentType } from '../../types/agent';

interface AgentStatusCardProps {
  agent: AgentType;
}

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agent }) => {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-start">
        <div>
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
        
        <div className="flex">
          {agent.status === 'active' ? (
            <button className="p-1 rounded-lg hover:bg-background-light">
              <Pause size={18} />
            </button>
          ) : (
            <button className="p-1 rounded-lg hover:bg-background-light">
              <Play size={18} />
            </button>
          )}
          
          <button className="p-1 rounded-lg hover:bg-background-light ml-1">
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
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
          <p className="text-text-secondary">PnL (24h)</p>
          <p className={`mt-1 ${agent.pnl24h >= 0 ? 'text-primary' : 'text-red-500'}`}>
            {agent.pnl24h >= 0 ? '+' : ''}{agent.pnl24h.toFixed(2)}%
          </p>
        </div>
        
        <div>
          <p className="text-text-secondary">Trades</p>
          <p className="mt-1">{agent.trades}</p>
        </div>
        
        <div>
          <p className="text-text-secondary">Model</p>
          <p className="mt-1">{agent.model}</p>
        </div>
      </div>
      
      {agent.status === 'active' && (
        <div className="mt-3 text-xs">
          <div className="bg-background-dark p-2 rounded font-mono text-primary">
            <p className="truncate">Last action: Buy 0.15 ETH @ $3,204.35</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentStatusCard;