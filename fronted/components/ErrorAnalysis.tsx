import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ErrorMetric } from '../types';

const fallbackMetrics: ErrorMetric[] = [
  { name: '复杂语法', value: 45, color: '#0071e3' }, // Apple Blue
  { name: '词汇缺口', value: 30, color: '#5e5ce6' }, // Indigo
  { name: '逻辑陷阱', value: 15, color: '#32ade6' }, // Cyan
  { name: '格式错误', value: 10, color: '#e5e5ea' }, // Light Gray
];

interface ErrorAnalysisProps {
  metrics?: ErrorMetric[];
  pendingCount?: number;
}

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ metrics, pendingCount }) => {
  const data = metrics?.length ? metrics : fallbackMetrics;
  const pending = pendingCount ?? 12;

  return (
    <div className="h-[400px] rounded-[32px] glass-panel p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 border border-white/60">
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">错因指纹分析</h2>
        <p className="text-xl font-bold text-[#1D1D1F]">语法薄弱点聚焦</p>
      </div>

      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
               itemStyle={{ color: '#1D1D1F', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-4xl font-bold text-[#1D1D1F]">{pending}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">待处理项</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorAnalysis;
