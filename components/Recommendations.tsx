import React, { useState, useEffect } from 'react';
import { PlayCircle, PenTool, Mic, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Recommendation } from '../types';
import { getRecommendations } from '../services/backendApi';

interface RecommendationsProps {
  onNavigate?: () => void;
}

// 默认推荐数据（后备）
const defaultRecommendations: Recommendation[] = [
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

const Recommendations: React.FC<RecommendationsProps> = ({ onNavigate }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await getRecommendations();
      if (data && data.length > 0) {
        // 转换后端数据格式
        setRecommendations(data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          duration: r.duration,
          difficulty: r.difficulty
        })));
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // 保持默认数据
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0071e3]" size={32} />
      </div>
    );
  }

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
        {recommendations.map((rec) => (
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
                    rec.category === 'Listening' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                      'bg-gradient-to-br from-orange-400 to-amber-500'}
              `}>
                {rec.category === 'Writing' && <PenTool size={20} />}
                {rec.category === 'Speaking' && <Mic size={20} />}
                {rec.category === 'Reading' && <BookOpen size={20} />}
                {rec.category === 'Listening' && <PlayCircle size={20} />}
              </div>
              <div>
                <h3 className="font-semibold text-[#1D1D1F] mb-1 group-hover:text-[#0071e3] transition-colors">{rec.title}</h3>
                <p className="text-sm text-gray-500">{rec.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`
                text-xs font-semibold px-3 py-1.5 rounded-full
                ${rec.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                  rec.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-600'}
              `}>
                {rec.difficulty}
              </span>
              <PlayCircle className="text-gray-400 group-hover:text-[#0071e3] transition-colors" size={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;