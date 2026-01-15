import React, { useEffect, useState } from 'react';
import { Target, Zap, AlertTriangle, ShieldCheck, Headphones, BookOpen, PenTool, Mic, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { WeaknessModule, WeaknessOverviewData, WeaknessStat, WeaknessSuggestion } from '../types';
import { getWeaknessData } from '../services/uiService';

interface WeaknessPageProps {
  isDarkMode?: boolean;
}

const fallbackWeaknessData: WeaknessModule[] = [
  { id: 'Listening', name: 'Listening', score: 6.5, weak_point: 'Multiple Choice' },
  { id: 'Reading', name: 'Reading', score: 7.0, weak_point: 'True/False/NG' },
  { id: 'Writing', name: 'Writing', score: 6.0, weak_point: 'Coherence' },
  { id: 'Speaking', name: 'Speaking', score: 6.5, weak_point: 'Fluency' },
];

const fallbackDetailedStats: Record<string, WeaknessStat[]> = {
  Listening: [
    { type: 'Multiple Choice', accuracy: 55, color: '#f59e0b' },
    { type: 'Map Labeling', accuracy: 65, color: '#f59e0b' },
    { type: 'Form Completion', accuracy: 92, color: '#22c55e' },
    { type: 'Matching', accuracy: 70, color: '#22c55e' },
  ],
  Reading: [
    { type: 'True/False/NG', accuracy: 45, color: '#ef4444' }, // Red - Critical
    { type: 'Heading Match', accuracy: 62, color: '#f59e0b' }, // Yellow - Warning
    { type: 'Summary Completion', accuracy: 88, color: '#22c55e' }, // Green - Good
    { type: 'Multiple Choice', accuracy: 55, color: '#f59e0b' },
  ],
  Writing: [
    { type: 'Task Response', accuracy: 68, color: '#f59e0b' },
    { type: 'Coherence', accuracy: 48, color: '#ef4444' },
    { type: 'Lexical Resource', accuracy: 72, color: '#22c55e' },
    { type: 'Grammar', accuracy: 65, color: '#f59e0b' },
  ],
  Speaking: [
    { type: 'Fluency', accuracy: 58, color: '#ef4444' },
    { type: 'Pronunciation', accuracy: 75, color: '#22c55e' },
    { type: 'Lexical Resource', accuracy: 68, color: '#f59e0b' },
    { type: 'Grammar', accuracy: 65, color: '#f59e0b' },
  ]
};

const fallbackSuggestions: Record<string, WeaknessSuggestion> = {
  Listening: {
    priority: "需要关注",
    issue: "Multiple Choice 题目中的干扰项导致 40% 的错误率。您倾向于选择最先提到的选项，而不是等待转折。",
    action1: "练习干扰项识别",
    action2: "练习等待转折"
  },
  Reading: {
    priority: "高优先级",
    issue: "True/False/Not Given 逻辑判断在 'Not Given' 推理上持续失误。您将'信息缺失'与'False'混淆。",
    action1: "练习 20 道 T/F/NG 逻辑题",
    action2: "回顾逻辑错误档案"
  },
  Writing: {
    priority: "紧急警报",
    issue: "连贯性得分较低，因为正文段缺乏清晰的主题句。段落过渡生硬。",
    action1: "练习构建 5 个正文段",
    action2: "复习连接词"
  },
  Speaking: {
    priority: "中等优先级",
    issue: "Part 2 中过度的自我纠正影响了流利度。您经常停顿寻找完美的词汇。",
    action1: "影子跟读练习（提速）",
    action2: "学习 10 个填充词"
  }
};

// Mock error questions data
interface ErrorQuestion {
  id: string;
  source: string;
  question: string;
  context: string;
  correct: string;
  userAnswer?: string;
  errorType: string;
}

const mockErrorQuestions: Record<string, ErrorQuestion[]> = {
  'True/False/NG': [
    {
      id: 'TFN-001',
      source: 'C18T2P1 - Q3',
      question: 'The__(study/research)__was conducted over a period of several years.',
      context: 'The researchers began their work in 2015 and published their findings in 2018...',
      correct: 'NOT GIVEN',
      userAnswer: 'FALSE',
      errorType: '无中生有'
    },
    {
      id: 'TFN-002',
      source: 'C17T3P2 - Q7',
      question: 'Ancient civilizations understood the concept of zero.',
      context: 'While some ancient cultures had placeholder symbols, the true mathematical concept of zero...',
      correct: 'FALSE',
      userAnswer: 'NOT GIVEN',
      errorType: '程度偏差'
    },
    {
      id: 'TFN-003',
      source: 'C16T1P3 - Q12',
      question: 'The new policy was universally welcomed by all stakeholders.',
      context: 'Most industry representatives expressed support, though some environmental groups raised concerns...',
      correct: 'FALSE',
      userAnswer: 'TRUE',
      errorType: '绝对词陷阱'
    },
  ],
  'Heading Match': [
    {
      id: 'HM-001',
      source: 'C19T1P2 - Q15',
      question: 'Paragraph C discusses the primary focus of...',
      context: 'The paragraph mainly describes the economic implications rather than social factors...',
      correct: 'viii',
      userAnswer: 'v',
      errorType: '段落主旨偏离'
    },
    {
      id: 'HM-002',
      source: 'C18T4P1 - Q18',
      question: 'Paragraph E is best described by heading...',
      context: 'This section transitions from historical context to modern applications...',
      correct: 'iii',
      userAnswer: 'vi',
      errorType: '细节干扰'
    },
  ],
  'Summary Completion': [
    {
      id: 'SC-001',
      source: 'C17T2P3 - Q28',
      question: 'The development of ____ led to significant improvements in efficiency.',
      context: 'The passage mentions several technological advances, but specifically highlights automation systems...',
      correct: 'automation',
      userAnswer: 'technology',
      errorType: '同义词混淆'
    },
  ],
  'Multiple Choice': [
    {
      id: 'MC-001',
      source: 'C16T4P2 - Q20',
      question: 'According to the passage, what is the main reason for the decline?',
      context: 'While multiple factors are mentioned, the author emphasizes that funding cuts were the primary cause...',
      correct: 'B',
      userAnswer: 'C',
      errorType: '主次因果混淆'
    },
    {
      id: 'MC-002',
      source: 'C15T3P1 - Q5',
      question: 'The author\'s attitude towards the new approach can best be described as...',
      context: 'The tone throughout suggests cautious optimism with some reservations...',
      correct: 'A',
      userAnswer: 'D',
      errorType: '态度词误判'
    },
  ],
};

const WeaknessPage: React.FC<WeaknessPageProps> = ({ isDarkMode }) => {
  const [activeModule, setActiveModule] = useState<string>('Reading');
  const [overview, setOverview] = useState<WeaknessOverviewData | null>(null);
  const [repairMode, setRepairMode] = useState(false); // Show error question bank
  const [repairQuestionType, setRepairQuestionType] = useState<string>(''); // Selected question type for repair

  useEffect(() => {
    let isMounted = true;
    getWeaknessData()
      .then((data) => {
        if (isMounted) {
          setOverview(data);
          if (data.modules?.length && !data.modules.find((m) => m.id === activeModule)) {
            setActiveModule(data.modules[0].id);
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load weakness data:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const panelClass = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'glass-panel border-white/60 text-[#1D1D1F]';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const modules = overview?.modules?.length ? overview.modules : fallbackWeaknessData;
  const detailedStats = overview?.detailed_stats || fallbackDetailedStats;
  const suggestions = overview?.suggestions || fallbackSuggestions;
  const currentStats = detailedStats[activeModule] || [];
  const currentSuggestion = suggestions[activeModule];

  const moduleIcons: Record<string, React.ReactNode> = {
    Listening: <Headphones size={20} />,
    Reading: <BookOpen size={20} />,
    Writing: <PenTool size={20} />,
    Speaking: <Mic size={20} />,
  };

  // Get error questions for selected type
  const errorQuestions = mockErrorQuestions[repairQuestionType] || [];

  // Repair Mode - Error Question Bank View
  if (repairMode) {
    return (
      <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 px-6 md:px-0">
          <button
            onClick={() => setRepairMode(false)}
            className={`mb-4 flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}
          >
            <ArrowLeft size={16} /> 返回薄弱点诊断
          </button>
          <h1 className="text-3xl font-bold tracking-tight mb-2 inherit flex items-center gap-3">
            <Target size={32} className="text-red-500" /> {repairQuestionType} 错题本
          </h1>
          <p className={`${textMuted} text-lg`}>以下是您在该题型中的历史错题，点击重做进行巩固练习。</p>
        </header>

        {/* Stats Bar */}
        <div className={`mx-6 md:mx-0 mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={24} className="text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{errorQuestions.length}</div>
                <div className={`text-xs ${textMuted}`}>待修复错题</div>
              </div>
            </div>
            <button className="px-6 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors">
              推荐相似题目
            </button>
          </div>
        </div>

        {/* Error Questions List */}
        <div className="px-6 md:px-0 space-y-4">
          {errorQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'} hover:shadow-lg transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {q.source}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                    {q.errorType}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-500">您的答案: {q.userAnswer}</span>
                    <span className={textMuted}>|</span>
                    <span className="text-green-600">正确答案: {q.correct}</span>
                  </div>
                </div>
              </div>

              <p className="font-medium text-lg mb-3">{q.question}</p>

              <div className={`p-4 rounded-lg text-sm italic mb-4 ${isDarkMode ? 'bg-black/20 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                " {q.context} "
              </div>

              <div className="flex justify-end gap-3">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium border ${isDarkMode ? 'border-white/10 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                  查看解析
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  重做此题
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
      <header className="mb-12 px-6 md:px-0">
        <h1 className="text-4xl font-bold tracking-tight mb-2 inherit flex items-center gap-3">
          <Zap size={36} className="text-orange-500" /> 薄弱点爆破
        </h1>
        <p className={`${textMuted} text-lg`}>针对性修复结构性弱点。</p>
      </header>

      <div className="grid grid-cols-12 gap-8 px-6 md:px-0">

        {/* Top Level Status - Clickable Modules */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {modules.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveModule(item.id)}
              className={`p-6 rounded-[24px] ${panelClass} border-l-4 
                 ${item.score < 6.5 ? 'border-l-red-500' : 'border-l-green-500'} 
                 ${activeModule === item.id ? (isDarkMode ? 'bg-white/20' : 'bg-white shadow-lg scale-105') : 'opacity-80 hover:opacity-100'}
                 relative overflow-hidden group cursor-pointer transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg flex items-center gap-2">
                  {moduleIcons[item.id] || moduleIcons[item.name]} {item.name}
                </span>
                <span className={`font-mono font-bold ${item.score < 6.5 ? 'text-red-500' : 'text-green-500'}`}>{item.score}</span>
              </div>
              <div className="text-xs opacity-60 uppercase tracking-wide">严重失误点:</div>
              <div className="font-medium text-sm mt-1">{item.weak_point}</div>
              {activeModule === item.id && (
                <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Breakdown */}
        <div className={`col-span-12 lg:col-span-8 p-8 rounded-[32px] ${panelClass} transition-all duration-500`}>
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Target size={20} /> {activeModule} 模块诊断
          </h3>

          <div className="h-[300px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentStats} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#888' : '#333', fontSize: 12 }} width={90} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', background: isDarkMode ? '#333' : '#fff' }} />
                <Bar dataKey="accuracy" barSize={32} radius={[0, 4, 4, 0]}>
                  {currentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStats.map((t, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'} ${t.accuracy < 60 ? 'ring-1 ring-red-500/50' : ''}`}>
                <div>
                  <div className="font-bold text-sm">{t.type}</div>
                  <div className={`text-xs font-mono mt-1 ${t.accuracy < 60 ? 'text-red-500' : t.accuracy < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                    准确率: {t.accuracy}%
                  </div>
                </div>
                <button
                  onClick={() => { setRepairQuestionType(t.type); setRepairMode(true); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${t.accuracy < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-black hover:text-white'}`}
                >
                  开始修复
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: AI Prescription */}
        <div className={`col-span-12 lg:col-span-4 p-8 rounded-[32px] ${panelClass} relative overflow-hidden transition-all duration-500`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none"></div>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
            <AlertTriangle size={20} className="text-orange-500" /> AI 建议
          </h3>
          {currentSuggestion && (
            <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeModule}>
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <h4 className="font-bold text-orange-500 text-sm mb-2">{currentSuggestion.priority}</h4>
                <p className="text-sm opacity-80">{currentSuggestion.issue}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold opacity-60">建议行动:</h4>
                <div className={`p-3 rounded-lg flex items-center gap-3 text-sm cursor-pointer hover:bg-white/10 transition-colors border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <Zap size={16} className="text-orange-500" />
                  <span>{currentSuggestion.action1}</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center gap-3 text-sm cursor-pointer hover:bg-white/10 transition-colors border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <ShieldCheck size={16} className="text-green-500" />
                  <span>{currentSuggestion.action2}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default WeaknessPage;
