import React from 'react';
import { LayoutDashboard, BookOpen, PieChart, Settings, Home, Layers, Zap, Database } from 'lucide-react';
import { ViewState } from '../App';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-8 z-50 hidden md:flex glass-panel border-r border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="mb-10 cursor-pointer group" onClick={() => onNavigate('intro')}>
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/30 transition-all duration-500 ease-out relative overflow-hidden">
          <span className="relative z-10">L</span>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        <NavItem 
          icon={<Home size={22} />} 
          active={currentView === 'intro'} 
          onClick={() => onNavigate('intro')}
          tooltip="首页 (Home)"
        />
        <NavItem 
          icon={<LayoutDashboard size={22} />} 
          active={currentView === 'dashboard'} 
          onClick={() => onNavigate('dashboard')}
          tooltip="仪表盘 (Dashboard)"
        />
        
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-1 opacity-50"></div>
        
        <NavItem 
          icon={<Layers size={22} />} 
          active={currentView === 'foundation'}
          onClick={() => onNavigate('foundation')} 
          tooltip="核心能力 (Core Systems)"
        />
        <NavItem 
          icon={<BookOpen size={22} />} 
          active={currentView === 'practice'}
          onClick={() => onNavigate('practice')} 
          tooltip="全真模考 (Simulation)"
        />
        <NavItem 
          icon={<Zap size={22} />} 
          active={currentView === 'weakness'}
          onClick={() => onNavigate('weakness')} 
          tooltip="薄弱点爆破 (Hull Repair)"
        />
        
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-1 opacity-50"></div>

        <NavItem 
          icon={<PieChart size={22} />} 
          active={currentView === 'analysis'}
          onClick={() => onNavigate('analysis')} 
          tooltip="任务日志 (Mission Log)"
        />
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-6 items-center mb-4">
        <button 
          onClick={() => onNavigate('settings')}
          className={`
            p-3 rounded-2xl transition-all duration-300
            ${currentView === 'settings' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-white hover:text-black hover:shadow-lg'}
          `}
        >
          <Settings size={22} />
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm border border-white hover:ring-2 hover:ring-blue-100 transition-all">
          <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, active, onClick, tooltip }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        p-3.5 rounded-[18px] transition-all duration-500 group relative
        ${active 
          ? 'bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] scale-110' 
          : 'text-gray-400 hover:text-black hover:bg-white/80 hover:shadow-lg hover:shadow-blue-500/5'
        }
      `}
      title={tooltip}
    >
      {icon}
      {/* Active Indicator Dot */}
      {active && (
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full block md:hidden"></span>
      )}
    </button>
  );
};

export default Sidebar;