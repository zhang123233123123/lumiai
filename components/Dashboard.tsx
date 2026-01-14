import React from 'react';
import LearningPulse from './LearningPulse';
import ErrorAnalysis from './ErrorAnalysis';
import Recommendations from './Recommendations';
import { Bell, Search } from 'lucide-react';
import { ViewState } from '../App';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-10 px-6 md:px-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">欢迎回来，Sarah</h1>
          <p className="text-gray-500 flex items-center gap-2">
            今日学习势能强劲
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0071e3] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索知识点..." 
              className="bg-white/80 backdrop-blur-md pl-10 pr-4 py-2.5 rounded-2xl w-64 text-sm border border-transparent shadow-sm focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
            />
          </div>
          <button className="p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-500 hover:text-black hover:scale-110 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6 px-6 md:px-0">
        
        {/* Top Full Width - Learning Pulse */}
        <div className="col-span-12 transform hover:scale-[1.01] transition-transform duration-500">
           <LearningPulse />
        </div>

        {/* Middle Row */}
        <div className="col-span-12 lg:col-span-5 transform hover:scale-[1.01] transition-transform duration-500">
           <ErrorAnalysis />
        </div>
        
        <div className="col-span-12 lg:col-span-7 transform hover:scale-[1.01] transition-transform duration-500">
           <Recommendations onNavigate={() => onNavigate('practice')} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;