import React, { useEffect, useState } from 'react';
import { Target, Zap, AlertTriangle, ShieldCheck, Headphones, BookOpen, PenTool, Mic } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
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
    priority: "Attention Required",
    issue: "Distractors in Multiple Choice questions are causing a 40% error rate. You tend to select the first option mentioned without waiting for the 'turn'.",
    action1: "Drill 'Distractor Recognition'",
    action2: "Practice 'Wait for the Turn'"
  },
  Reading: {
    priority: "High Priority",
    issue: "True/False/Not Given logic circuits are failing consistently on 'Not Given' inference. You are confusing 'Absence of Info' with 'False'.",
    action1: "Drill 20 T/F/NG Logic Gates",
    action2: "Review Logic Failures Archive"
  },
  Writing: {
    priority: "Critical Alert",
    issue: "Coherence scores are suffering due to lack of clear topic sentences in body paragraphs. Paragraph transitions are abrupt.",
    action1: "Structure 5 Body Paragraphs",
    action2: "Review Linking Words"
  },
  Speaking: {
    priority: "Moderate Priority",
    issue: "Fluency is interrupted by excessive self-correction in Part 2. You are pausing too often to search for perfect vocabulary.",
    action1: "Shadowing Practice (Speed)",
    action2: "Learn 10 Filler Phrases"
  }
};

const WeaknessPage: React.FC<WeaknessPageProps> = ({ isDarkMode }) => {
  const [activeModule, setActiveModule] = useState<string>('Reading');
  const [overview, setOverview] = useState<WeaknessOverviewData | null>(null);

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

  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
      <header className="mb-12 px-6 md:px-0">
        <h1 className="text-4xl font-bold tracking-tight mb-2 inherit flex items-center gap-3">
          <Zap size={36} className="text-orange-500" /> Hull Integrity (薄弱点爆破)
        </h1>
        <p className={`${textMuted} text-lg`}>Targeted repair of structural weaknesses.</p>
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
                <div className="text-xs opacity-60 uppercase tracking-wide">Critical Failure:</div>
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
             <Target size={20} /> {activeModule} Module Diagnostics
           </h3>
           
           <div className="h-[300px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={currentStats} layout="vertical" margin={{left: 20}}>
                    <XAxis type="number" hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', background: isDarkMode ? '#333' : '#fff'}} />
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
                        Accuracy: {t.accuracy}%
                     </div>
                   </div>
                   <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${t.accuracy < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-black hover:text-white'}`}>
                      INITIATE REPAIR
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Right Panel: AI Prescription */}
        <div className={`col-span-12 lg:col-span-4 p-8 rounded-[32px] ${panelClass} relative overflow-hidden transition-all duration-500`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none"></div>
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
             <AlertTriangle size={20} className="text-orange-500" /> TARS Suggestion
           </h3>
           {currentSuggestion && (
             <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeModule}>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                   <h4 className="font-bold text-orange-500 text-sm mb-2">{currentSuggestion.priority}</h4>
                   <p className="text-sm opacity-80">{currentSuggestion.issue}</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-sm font-bold opacity-60">Recommended Action:</h4>
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
