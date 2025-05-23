import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  navItems: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

const Layout: React.FC<LayoutProps> = ({ children, navItems }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar navItems={navItems} currentPath={location.pathname} />
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-75 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-64">
          <Sidebar navItems={navItems} currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <TopBar toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;