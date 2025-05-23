import React from 'react';
import { AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import AgentStatusCard from '../components/dashboard/AgentStatusCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ConsoleLog from '../components/shared/ConsoleLog';
import { useAgentContext } from '../contexts/AgentContext';

const Dashboard: React.FC = () => {
  const { agents } = useAgentContext();
  const activeAgents = agents.filter(agent => agent.status === 'active');
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-outline">
            <TrendingUp size={16} className="mr-2" />
            Analytics
          </button>
          <button className="btn btn-primary">
            Deploy Agent
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card">
          <p className="text-text-secondary text-sm">Active Agents</p>
          <h3 className="text-2xl font-bold">0</h3>
          <div className="flex items-center mt-2 text-xs text-text-secondary">
            <span>No change</span>
          </div>
        </div>
        
        <div className="glass-card">
          <p className="text-text-secondary text-sm">Total PnL (24h)</p>
          <h3 className="text-2xl font-bold">$0.00</h3>
          <div className="flex items-center mt-2 text-xs text-text-secondary">
            <span>0.0%</span>
          </div>
        </div>
        
        <div className="glass-card">
          <p className="text-text-secondary text-sm">Executed Trades</p>
          <h3 className="text-2xl font-bold">0</h3>
          <div className="flex items-center mt-2 text-xs text-text-secondary">
            <span>0 buys / 0 sells</span>
          </div>
        </div>
        
        <div className="glass-card">
          <p className="text-text-secondary text-sm">Gas Spent (ETH)</p>
          <h3 className="text-2xl font-bold">0.0000</h3>
          <div className="flex items-center mt-2 text-xs text-text-secondary">
            <span>~$0.00 USD</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - agent statuses */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-medium">Agent Status</h2>
          <div className="space-y-4">
            {agents.map(agent => (
              <AgentStatusCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Right column - metrics and transactions */}
        <div className="lg:col-span-2 space-y-6">
          <MetricsPanel />
          <RecentTransactions />
        </div>
      </div>

      {/* Console log section */}
      <div className="glass-card">
        <h2 className="text-lg font-medium mb-3">Activity Log</h2>
        <ConsoleLog />
      </div>
    </div>
  );
};

export default Dashboard;