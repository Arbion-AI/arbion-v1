import React from 'react';
import { Lock, Key, Shield, Bell, DollarSign, Network, Code } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="btn btn-primary">
          Save Changes
        </button>
      </div>

      <div className="glass-card">
        <div className="flex items-center mb-4">
          <Key size={20} className="mr-2 text-primary" />
          <h2 className="text-lg font-medium">API Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <div className="flex">
              <input type="password" value="••••••••••••••••" readOnly className="glass-input flex-1" />
              <button className="btn btn-outline ml-2">Reveal</button>
              <button className="btn btn-outline ml-2">Regenerate</button>
            </div>
            <p className="text-xs text-text-secondary mt-1">Last used: 10 minutes ago</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Webhook URL</label>
            <input type="text" placeholder="https://your-server.com/webhook" className="glass-input w-full" />
          </div>
          
          <div className="flex items-center mt-4">
            <input type="checkbox" id="enableWebhooks" className="mr-2" />
            <label htmlFor="enableWebhooks" className="text-sm">Enable webhook notifications for agent events</label>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center mb-4">
          <Shield size={20} className="mr-2 text-primary" />
          <h2 className="text-lg font-medium">Security</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Two-Factor Authentication</label>
            <div className="flex items-center">
              <button className="btn btn-outline">Enable 2FA</button>
              <span className="ml-3 text-sm text-text-secondary">Not enabled</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">IP Whitelisting</label>
            <textarea className="glass-input w-full" rows={3} placeholder="Enter IP addresses, one per line"></textarea>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center mb-4">
          <DollarSign size={20} className="mr-2 text-primary" />
          <h2 className="text-lg font-medium">Trading Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Default Gas Price (Gwei)</label>
            <input type="number" defaultValue={5} min={1} className="glass-input w-full" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Default Slippage Tolerance (%)</label>
            <input type="number" defaultValue={0.5} min={0.1} step={0.1} className="glass-input w-full" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Transaction Size (USD)</label>
            <input type="number" defaultValue={1000} min={1} className="glass-input w-full" />
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center mb-4">
          <Bell size={20} className="mr-2 text-primary" />
          <h2 className="text-lg font-medium">Notifications</h2>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Email Alerts</label>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="emailAlerts" defaultChecked />
              <label htmlFor="emailAlerts" className="block bg-background-light w-12 h-6 rounded-full cursor-pointer"></label>
              <div className="dot absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition-transform transform translate-x-6"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm">Push Notifications</label>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="pushNotifications" defaultChecked />
              <label htmlFor="pushNotifications" className="block bg-background-light w-12 h-6 rounded-full cursor-pointer"></label>
              <div className="dot absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition-transform transform translate-x-6"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm">Trade Execution Alerts</label>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="tradeAlerts" defaultChecked />
              <label htmlFor="tradeAlerts" className="block bg-background-light w-12 h-6 rounded-full cursor-pointer"></label>
              <div className="dot absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition-transform transform translate-x-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;