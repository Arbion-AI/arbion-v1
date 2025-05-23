import React from 'react';
import { Link } from 'react-router-dom';
import { useToken } from '../../contexts/TokenContext';
import { useWallet } from '../../contexts/WalletContext';

interface SidebarProps {
  navItems: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, currentPath }) => {
  const { araiBalance } = useToken();
  const { isConnected } = useWallet();

  return (
    <aside className="h-full w-64 glass flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center">
        <img src="/log.png" alt="Arbion AI" className="w-8 h-8 mr-2" />
        <div>
          <h1 className="text-xl font-bold flex items-center">
            Arbion<span className="text-primary ml-1">AI</span>
          </h1>
          <p className="text-xs text-text-secondary">Agent Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all ${
                  currentPath === item.path
                    ? 'bg-primary text-background neon-border'
                    : 'hover:bg-background-light'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ARAI Balance */}
      <div className="p-4 glass-card m-4 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-text-secondary">ARAI Balance</p>
          <p className="text-xl font-bold mt-1">
            {isConnected ? (
              araiBalance ? (
                `${araiBalance.formatted} ARAI`
              ) : (
                '0 ARAI'
              )
            ) : (
              'Connect Wallet'
            )}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;