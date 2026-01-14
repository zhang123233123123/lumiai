import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { LearningPulseData } from '../types';

const fallbackPoints = [
  { day: '周一', score: 6.5 },
  { day: '周二', score: 6.8 },
  { day: '周三', score: 6.7 },
  { day: '周四', score: 7.2 },
  { day: '周五', score: 7.0 },
  { day: '周六', score: 7.5 },
  { day: '周日', score: 7.8 },
];

interface LearningPulseProps {
  data?: LearningPulseData;
}

const LearningPulse: React.FC<LearningPulseProps> = ({ data }) => {
  const points = data?.points?.length ? data.points : fallbackPoints;
  const predictedScore = data?.predicted_score ?? 7.5;
  const weeklyDelta = data?.weekly_delta ?? 0.3;
  const deltaLabel = `${weeklyDelta >= 0 ? '+' : ''}${weeklyDelta}`;

  return (
    <div className="w-full h-72 rounded-[32px] glass-panel p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 border border-white/60">
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse"></span>
          学习脉搏 (Learning Pulse)
        </h2>
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-bold tracking-tight text-[#1D1D1F]">{predictedScore.toFixed(1)}</h1>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium">预测分</span>
            <span className="text-green-600 text-xs font-bold bg-green-100/50 px-2 py-0.5 rounded-full mt-1">本周 {deltaLabel}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-full absolute bottom-0 left-0 right-0 pt-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 50, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              cursor={{ stroke: '#0071e3', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }}
              labelStyle={{ color: '#888', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#0071e3" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LearningPulse;
