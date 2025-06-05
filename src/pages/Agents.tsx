import React, { useState } from "react";
import { Plus, Filter, ChevronDown } from "lucide-react";
import AgentCard from "../components/agents/AgentCard";
import AgentForm from "../components/agents/AgentForm";
import { useAgentContext } from "../contexts/AgentContext";

const Agents: React.FC = () => {
  const { agents } = useAgentContext();
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showStrategyFilter, setShowStrategyFilter] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const strategies = [
    "Cross-exchange arbitrage",
    "Momentum trading",
    "Mean reversion",
    "Grid trading",
    "Custom strategy",
  ];

  const filteredAgents = agents.filter((agent) => {
    if (filterStatus && agent.status !== filterStatus) return false;
    if (selectedStrategy && agent.strategy !== selectedStrategy) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Agents</h1>

        <button
          onClick={() => setShowNewAgentForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          New Agent
        </button>
      </div>

      <div className="glass-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-medium">Trading Agents</h2>
            <p className="text-text-secondary text-sm">
              Configure and manage your AI trading agents
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                className="glass-input flex items-center"
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowStrategyFilter(false);
                }}
              >
                <Filter size={16} className="mr-2" />
                Status
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showStatusFilter && (
                <div className="absolute right-0 mt-2 w-48 glass-card z-50">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                      onClick={() => {
                        setFilterStatus(null);
                        setShowStatusFilter(false);
                      }}
                    >
                      All
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                      onClick={() => {
                        setFilterStatus("active");
                        setShowStatusFilter(false);
                      }}
                    >
                      Active
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                      onClick={() => {
                        setFilterStatus("paused");
                        setShowStatusFilter(false);
                      }}
                    >
                      Paused
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                      onClick={() => {
                        setFilterStatus("error");
                        setShowStatusFilter(false);
                      }}
                    >
                      Error
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="glass-input flex items-center"
                onClick={() => {
                  setShowStrategyFilter(!showStrategyFilter);
                  setShowStatusFilter(false);
                }}
              >
                <Filter size={16} className="mr-2" />
                Strategy Type
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showStrategyFilter && (
                <div className="absolute right-0 mt-2 w-56 glass-card z-50">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                      onClick={() => {
                        setSelectedStrategy(null);
                        setShowStrategyFilter(false);
                      }}
                    >
                      All Strategies
                    </button>
                    {strategies.map((strategy) => (
                      <button
                        key={strategy}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-background-light"
                        onClick={() => {
                          setSelectedStrategy(strategy);
                          setShowStrategyFilter(false);
                        }}
                      >
                        {strategy}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent grid */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-background-light p-4 rounded-full mb-4">
              <Plus size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium">No Agents Found</h3>
            <p className="text-text-secondary mt-2 max-w-md">
              {filterStatus || selectedStrategy
                ? "No agents match the selected filters. Try adjusting your filters or create a new agent."
                : 'You haven\'t created any trading agents yet. Click the "New Agent" button to get started.'}
            </p>
            <button
              onClick={() => setShowNewAgentForm(true)}
              className="btn btn-primary mt-4"
            >
              Create Your First Agent
            </button>
          </div>
        )}
      </div>

      {/* New agent form dialog */}
      {showNewAgentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-2xl rounded-xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Create New Trading Agent
              </h2>
              <AgentForm onClose={() => setShowNewAgentForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
