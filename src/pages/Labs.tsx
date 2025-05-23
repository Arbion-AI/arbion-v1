import React from 'react';
import { useToken } from '../contexts/TokenContext';
import { ExternalLink, Lock } from 'lucide-react';

const Labs: React.FC = () => {
  const { araiBalance } = useToken();
  const requiredBalance = 300000;
  const hasAccess = araiBalance && parseFloat(araiBalance.formatted.replace(/,/g, '')) >= requiredBalance;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Arbion Labs</h1>
          <p className="text-text-secondary mt-1">Access experimental features and early previews</p>
        </div>
      </div>

      <div className="glass-card">
        {hasAccess ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Welcome to Arbion Labs</h2>
                <p className="text-text-secondary mt-1">You have access to exclusive features</p>
              </div>
              <div className="flex items-center px-3 py-1 bg-background rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary status-active mr-2"></div>
                <span className="text-primary text-sm">Access Granted</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card">
                <h3 className="text-lg font-medium mb-2">Community Access</h3>
                <p className="text-text-secondary mb-4">
                  Join our exclusive Telegram group to connect with other Arbion Labs members
                </p>
                <a 
                  href="https://t.me/+nrR5lLx5ER8zZTlk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center justify-center"
                >
                  Join Telegram Group
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-background-light p-4 rounded-full inline-block mb-4">
              <Lock size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Access Required</h2>
            <p className="text-text-secondary max-w-md mx-auto mb-6">
              Hold at least {requiredBalance.toLocaleString()} ARAI tokens to access Arbion Labs features
            </p>
            <div className="glass-card inline-block">
              <p className="text-sm text-text-secondary mb-1">Your Balance</p>
              <p className="text-xl font-bold">
                {araiBalance ? araiBalance.formatted : '0'} ARAI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;