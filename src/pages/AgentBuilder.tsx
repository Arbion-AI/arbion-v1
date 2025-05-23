import React, { useState } from 'react';
import { Play, Save, Code, Settings, Plus, Brain, Wand2 } from 'lucide-react';
import ConsoleLog from '../components/shared/ConsoleLog';

const AgentBuilder: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState('');

  const agentTemplates = [
    {
      id: 'market-maker',
      name: 'Market Maker',
      description: 'Automated market making with dynamic pricing',
      capabilities: ['Price Discovery', 'Liquidity Provision']
    },
    {
      id: 'sentiment-trader',
      name: 'Sentiment Trader',
      description: 'Trade based on market sentiment analysis',
      capabilities: ['NLP', 'Social Media Analysis']
    },
    {
      id: 'pattern-trader',
      name: 'Pattern Trader',
      description: 'Technical analysis pattern recognition',
      capabilities: ['Chart Analysis', 'Signal Generation']
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Agent Builder</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary flex items-center gap-2 w-full sm:w-auto">
            <Brain size={18} />
            Train Agent
          </button>
          <button className="btn btn-outline flex items-center gap-2 w-full sm:w-auto">
            <Wand2 size={18} />
            Quick Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Panel - Agent Templates */}
        <div className="glass-card">
          <h2 className="text-lg font-medium mb-4">Agent Templates</h2>
          <div className="space-y-3">
            {agentTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedAgent === template.id
                    ? 'bg-primary bg-opacity-20 border border-primary'
                    : 'bg-background-light hover:bg-opacity-50'
                }`}
                onClick={() => setSelectedAgent(template.id)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.capabilities.map((capability, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-background"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Agent Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
              <h2 className="text-lg font-medium">Agent Configuration</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button className="btn btn-outline text-xs flex items-center gap-2 flex-1 sm:flex-initial justify-center">
                  <Settings size={14} />
                  Parameters
                </button>
                <button className="btn btn-outline text-xs flex items-center gap-2 flex-1 sm:flex-initial justify-center">
                  <Save size={14} />
                  Save
                </button>
                <button className="btn btn-primary text-xs flex items-center gap-2 flex-1 sm:flex-initial justify-center">
                  <Play size={14} />
                  Test Run
                </button>
              </div>
            </div>

            <div className="bg-background-dark rounded-lg p-4 h-[400px] font-mono text-sm overflow-y-auto">
              {selectedAgent ? (
                <div className="space-y-4">
                  <div className="glass-card">
                    <h3 className="text-sm font-medium mb-2">Model Selection</h3>
                    <select className="glass-input w-full">
                      <option value="gpt-4">GPT-4 (Recommended)</option>
                      <option value="claude">Claude</option>
                      <option value="custom">Custom Model</option>
                    </select>
                  </div>

                  <div className="glass-card">
                    <h3 className="text-sm font-medium mb-2">Training Parameters</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Learning Rate"
                          className="glass-input w-full"
                        />
                        <input
                          type="text"
                          placeholder="Batch Size"
                          className="glass-input w-full"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Training Epochs"
                        className="glass-input w-full"
                      />
                    </div>
                  </div>

                  <div className="glass-card">
                    <h3 className="text-sm font-medium mb-2">Agent Behavior</h3>
                    <textarea
                      className="glass-input w-full h-32 resize-none"
                      placeholder="Define agent behavior and constraints..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="text-text-secondary text-center py-8">
                  Select an agent template to begin configuration
                </div>
              )}
            </div>
          </div>

          {/* Console Output */}
          <div className="glass-card">
            <h2 className="text-lg font-medium mb-4">Training Output</h2>
            <ConsoleLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentBuilder;