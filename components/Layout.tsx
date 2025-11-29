import React from 'react';
import { NavLink } from 'react-router-dom'; // Note: Using HashRouter, so we use react-router-dom props
import { LayoutDashboard, Calendar, PenTool, Settings, Zap, Image as ImageIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-white shadow-md' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className={`flex h-screen w-full ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-full w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              MarkyClone
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Social Scheduler</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/generate" icon={Zap} label="Quick Generator" />
            <NavItem to="/calendar" icon={Calendar} label="Calendar" />
            <NavItem to="/assets" icon={ImageIcon} label="Asset Library" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
             <button
               onClick={toggleDarkMode}
               className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
             >
               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
             </button>
          </div>
        </aside>

        {/* Mobile Header (visible only on small screens) */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b z-50 flex items-center px-4 justify-between">
           <span className="font-bold text-lg text-primary">MarkyClone</span>
           {/* Simple mobile menu trigger placeholder */}
           <button className="p-2">☰</button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
