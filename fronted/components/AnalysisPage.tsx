import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Sparkles, Brain, AlertCircle, RefreshCw, FileText, ChevronRight, Star, Clock, Target, TrendingUp, Activity, Radio, Orbit, Calendar } from 'lucide-react';
import { AnalysisOverviewData, QuestionTypeStat, ReportPeriod, TimeDataPoint } from '../types';
import { getAnalysisData } from '../services/uiService';

interface AnalysisPageProps {
  isDarkMode?: boolean;
}

const fallbackTimeData: TimeDataPoint[] = [
  { name: 'Listening', hours: 12.5 },
  { name: 'Reading', hours: 15.2 },
  { name: 'Writing', hours: 8.4 },
  { name: 'Speaking', hours: 5.1 },
];

const fallbackQuestionTypeData: QuestionTypeStat[] = [
  { name: 'T/F/NG', accuracy: 45, full: 100 },
  { name: 'Multiple Choice', accuracy: 65, full: 100 },
  { name: 'Matching', accuracy: 78, full: 100 },
  { name: 'Fill-in', accuracy: 88, full: 100 },
];

const AnalysisPage: React.FC<AnalysisPageProps> = ({ isDarkMode }) => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [overview, setOverview] = useState<AnalysisOverviewData | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAnalysisData()
      .then((data) => {
        if (isMounted) {
          setOverview(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load analysis data:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const panelClass = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'glass-panel border-white/60 text-[#1D1D1F]';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const timeData = overview?.time_data?.length ? overview.time_data : fallbackTimeData;
  const questionTypeData = overview?.question_type_data?.length ? overview.question_type_data : fallbackQuestionTypeData;
  const foundationStats = overview?.foundation_stats;
  const directives = overview?.directives;

  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">

      <header className="mb-8 px-6 md:px-0 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg shadow-lg ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <Activity size={20} />
            </div>
            <h1 className="text-3xl font-bold inherit tracking-tight">任务日志</h1>
          </div>
          <p className={textMuted}>跨时间维度的表现遥测数据。</p>
        </div>

        {/* Period Switcher */}
        <div className={`p-1 rounded-xl flex ${isDarkMode ? 'bg-white/10' : 'bg-white/50 border border-white/50'}`}>
          {(['daily', 'weekly', 'monthly'] as ReportPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setReportPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportPeriod === p ? (isDarkMode ? 'bg-white text-black' : 'bg-white shadow-sm text-black') : 'opacity-60 hover:opacity-100'}`}
            >
              {p === 'daily' ? '每日' : p === 'weekly' ? '每周' : '每月'}
            </button>
          ))}
        </div>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6 px-6 md:px-0">

        {/* 1. Time Distribution */}
        <div className={`col-span-12 md:col-span-4 rounded-[32px] p-8 ${panelClass} flex flex-col`}>
          <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} /> 时间分配 ({reportPeriod === 'daily' ? '每日' : reportPeriod === 'weekly' ? '每周' : '每月'})
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{ fill: isDarkMode ? '#888' : '#333', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', background: isDarkMode ? '#333' : '#fff' }} />
                <Bar dataKey="hours" fill="#0071e3" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/10 text-xs opacity-60 text-center">
            总专注时长: 41.2 小时
          </div>
        </div>

        {/* 2. Reading Detail Breakdown (Drill Down Example) */}
        <div className={`col-span-12 md:col-span-8 rounded-[32px] p-8 ${panelClass}`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest flex items-center gap-2">
              <Target size={16} className="text-orange-500" /> Reading 模块准确率
            </h3>
            <button className="text-xs bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold hover:bg-orange-500/20">分析 Reading</button>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionTypeData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#eee'} />
                <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#888' : '#333', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', background: isDarkMode ? '#333' : '#fff' }} />
                <Bar dataKey="accuracy" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {questionTypeData.map((entry, index) => (
                    <option key={index} /> // Dummy
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex-1">
              <span className="font-bold text-red-500 block mb-1">严重弱点</span>
              T/F/NG 准确率本{reportPeriod === 'daily' ? '日' : reportPeriod === 'weekly' ? '周' : '月'}下降了 15%。
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex-1">
              <span className="font-bold text-green-500 block mb-1">优势</span>
              Fill-in-the-blanks 保持稳定 {'>'} 85%。
            </div>
          </div>
        </div>

        {/* 3. Foundation Stats */}
        <div className={`col-span-12 md:col-span-6 rounded-[32px] p-8 ${panelClass}`}>
          <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Brain size={16} /> 基础系统
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
              <div className="text-3xl font-bold text-[#0071e3] mb-1">{foundationStats?.new_words ?? 124}</div>
              <div className="text-xs opacity-60">新获得单词</div>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
              <div className="text-3xl font-bold text-purple-500 mb-1">{foundationStats?.syntax_patterns ?? 18}</div>
              <div className="text-xs opacity-60">掌握的语法模式</div>
            </div>
          </div>
        </div>

        {/* 4. AI Strategic Advice */}
        <div className={`col-span-12 md:col-span-6 rounded-[32px] p-8 ${panelClass} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
          <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
            <Sparkles size={16} /> 战略指令（下一周期）
          </h3>
          <div className="space-y-4 relative z-10">
            {(directives?.length ? directives : [
              {
                title: '修复逻辑缺陷',
                description: '将下周 Reading 时间的 30% 专门用于弱点模块中的 True/False/Not Given 练习。',
              },
              {
                title: '扩充词汇库',
                description: '专注"环境"主题词汇。你在 C19T3P1 中的准确率低是由于同义词遗漏。',
              },
            ]).map((directive, index) => (
              <div className="flex gap-4 items-start" key={directive.title}>
                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0 ${index === 0 ? 'bg-[#0071e3]' : 'bg-purple-500'}`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{directive.title}</h4>
                  <p className={`text-sm ${textMuted} mt-1`}>{directive.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default AnalysisPage;
