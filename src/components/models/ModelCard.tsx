import React from 'react';
import { Database, RefreshCw, Trash, BarChart3 } from 'lucide-react';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    type: string;
    lastUpdated: string;
    accuracy: number;
    status: string;
    description: string;
  };
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="bg-primary bg-opacity-20 p-2 rounded-lg mr-3">
            <Database size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{model.name}</h3>
            <p className="text-text-secondary text-xs mt-1">{model.type}</p>
          </div>
        </div>
        
        <div className="flex">
          <span className={`px-2 py-1 rounded-full text-xs ${
            model.status === 'active' ? 'bg-primary bg-opacity-20 text-primary' :
            model.status === 'training' ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' : 
            'bg-red-500 bg-opacity-20 text-red-500'
          }`}>
            {model.status}
          </span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-text-secondary">{model.description}</p>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-text-secondary">Accuracy</p>
          <p className="mt-1">{(model.accuracy * 100).toFixed(1)}%</p>
        </div>
        
        <div>
          <p className="text-text-secondary">Last Updated</p>
          <p className="mt-1">{model.lastUpdated}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between">
        <button className="btn btn-glass text-xs flex items-center">
          <BarChart3 size={14} className="mr-1" />
          Performance
        </button>
        
        <div className="flex space-x-2">
          <button className="btn btn-glass text-xs flex items-center">
            <RefreshCw size={14} className="mr-1" />
            Retrain
          </button>
          
          <button className="btn btn-glass text-xs flex items-center text-red-500">
            <Trash size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;