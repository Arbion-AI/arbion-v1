import React, { useState } from 'react';
import { Play, Save, Code, Settings, Plus } from 'lucide-react';
import ConsoleLog from '../components/shared/ConsoleLog';

const Builder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    {
      id: 'arbitrage',
      name: 'Arbitrage Bot',
      description: 'Cross-exchange price arbitrage strategy',
      complexity: 'Medium'
    },
    {
      id: 'grid',
      name: 'Grid Trading',
      description: 'Automated grid trading strategy',
      complexity: 'Advanced'
    },
    {
      id: 'momentum',
      name: 'Momentum Trading',
      description: 'Trend-following momentum strategy',
      complexity: 'Medium'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Strategy Builder</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Strategy
          </button>
          <button className="btn btn-outline flex items-center gap-2">
            <Code size={18} />
            Import
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Templates */}
        <div className="glass-card">
          <h2 className="text-lg font-medium mb-4">Templates</h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'bg-primary bg-opacity-20 border border-primary'
                    : 'bg-background-light hover:bg-opacity-50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {template.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-background">
                    {template.complexity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Strategy Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Strategy Editor</h2>
              <div className="flex gap-2">
                <button className="btn btn-outline text-xs flex items-center gap-2">
                  <Settings size={14} />
                  Configure
                </button>
                <button className="btn btn-outline text-xs flex items-center gap-2">
                  <Save size={14} />
                  Save
                </button>
                <button className="btn btn-primary text-xs flex items-center gap-2">
                  <Play size={14} />
                  Deploy
                </button>
              </div>
            </div>

            <div className="bg-background-dark rounded-lg p-4 h-[400px] font-mono text-sm">
              <div className="text-text-secondary">
                // Select a template or create a new strategy to begin
              </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="glass-card">
            <h2 className="text-lg font-medium mb-4">Console Output</h2>
            <ConsoleLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Builder