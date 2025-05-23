import React, { createContext, useState, useContext } from 'react';
import { AgentType } from '../types/agent';

interface AgentContextProps {
  agents: AgentType[];
  createAgent: (agent: AgentType) => void;
  updateAgent: (id: string, updates: Partial<AgentType>) => void;
  deleteAgent: (id: string) => void;
}

const defaultAgents: AgentType[] = [
  {
    id: 'agent-1',
    name: 'ETH-BTC Arbitrage',
    strategy: 'Cross-exchange arbitrage',
    status: 'active',
    model: 'market-predictor-v1',
    pnl24h: 3.42,
    trades: 17,
    assets: [
      { name: 'ETH', allocation: 60 },
      { name: 'BTC', allocation: 40 }
    ],
    alerts: [
      { id: 'alert-1', message: 'High slippage detected', severity: 'warning' }
    ]
  },
  {
    id: 'agent-2',
    name: 'LINK Momentum',
    strategy: 'Momentum trading',
    status: 'paused',
    model: 'pattern-recognition',
    pnl24h: -1.24,
    trades: 8,
    assets: [
      { name: 'LINK', allocation: 100 }
    ],
    alerts: []
  }
];

const AgentContext = createContext<AgentContextProps>({
  agents: [],
  createAgent: () => {},
  updateAgent: () => {},
  deleteAgent: () => {}
});

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<AgentType[]>(defaultAgents);
  
  const createAgent = (agent: AgentType) => {
    setAgents(prev => [...prev, agent]);
  };
  
  const updateAgent = (id: string, updates: Partial<AgentType>) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === id ? { ...agent, ...updates } : agent
      )
    );
  };
  
  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id));
  };
  
  return (
    <AgentContext.Provider value={{ agents, createAgent, updateAgent, deleteAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => useContext(AgentContext);