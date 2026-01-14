import React from 'react';
import { PlayCircle, PenTool, Mic, ArrowRight } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  onNavigate?: () => void;
  recommendations?: Recommendation[];
}

const fallbackRecommendations: Recommendation[] = [
  {
    id: '1',
    title: '高级定语从句应用',
    category: 'Writing',
    duration: '15 分钟',
    difficulty: 'Hard'
  },
  {
    id: '2',
    title: 'Part 2 独白模拟',
    category: 'Speaking',
    duration: '10 分钟',
    difficulty: 'Medium'
  },
  {
    id: '3',
    title: '学术摘要快速定位',
    category: 'Reading',
    duration: '20 分钟',
    difficulty: 'Hard'
  }
];

const Recommendations: React.FC<RecommendationsProps> = ({ onNavigate, recommendations }) => {
  const items = recommendations?.length ? recommendations : fallbackRecommendations;
  return (
    <div className="h-[400px] flex flex-col gap-5">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-[#1D1D1F]">AI 智能推荐</h2>
        <button 
          onClick={onNavigate}
          className="text-sm text-[#0071e3] font-medium hover:opacity-70 transition-opacity flex items-center gap-1 group"
        >
          全部练习 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {items.map((rec) => (
          <div 
            key={rec.id}
            onClick={onNavigate}
            className="flex-1 glass-panel rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-white/60"
          >
            <div className="flex items-center gap-5">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110
                ${rec.category === 'Writing' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 
                  rec.category === 'Speaking' ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 
                  'bg-gradient-to-br from-orange-400 to-amber-500'}
              `}>
                {rec.category === 'Writing' && <PenTool size={20} />}
                {rec.category === 'Speaking' && <Mic size={20} />}
                {rec.category === 'Reading' && <BookIcon size={20} />}
              </div>
              
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0071e3] transition-colors">{rec.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-0.5 rounded-md border border-white">
                    {rec.category === 'Writing' ? '写作' : rec.category === 'Speaking' ? '口语' : '阅读'}
                  </span>
                  <span className="text-xs text-gray-400">{rec.duration} • {rec.difficulty === 'Hard' ? '进阶' : '中级'}</span>
                </div>
              </div>
            </div>

            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-[#0071e3] hover:bg-blue-50 transition-all">
              <PlayCircle size={28} className="text-gray-300 group-hover:text-[#0071e3] transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple icon wrapper
const BookIcon = ({ size }: { size: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export default Recommendations;
