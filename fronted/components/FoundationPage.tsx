import React, { useEffect, useMemo, useState } from 'react';
import { Database, Book, Plus, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { FoundationOverviewData, MemoryCurvePoint, RecentWord, SyntaxEntry } from '../types';
import { getFoundationData } from '../services/uiService';

interface FoundationPageProps {
  isDarkMode?: boolean;
}

const fallbackMemoryCurveData: MemoryCurvePoint[] = [
  { day: '1m', retention: 100 },
  { day: '20m', retention: 58 },
  { day: '1h', retention: 44 },
  { day: '9h', retention: 36 },
  { day: '1d', retention: 33 },
  { day: '2d', retention: 28 },
  { day: '6d', retention: 25 },
  { day: '31d', retention: 21 },
];

const fallbackRecentWords: RecentWord[] = [
  { word: 'Ubiquitous', part_of_speech: 'Adj.', days_ago: 3 },
  { word: 'Ephemeral', part_of_speech: 'Adj.', days_ago: 2 },
  { word: 'Resilient', part_of_speech: 'Adj.', days_ago: 5 },
  { word: 'Paradigm', part_of_speech: 'N.', days_ago: 4 },
  { word: 'Alleviate', part_of_speech: 'V.', days_ago: 1 },
];

const fallbackSyntaxEntries: SyntaxEntry[] = [
  {
    tag: 'Inversion (倒装)',
    sentence: '"Never before had the concept of interstellar travel seemed so plausible yet so distant."',
    analysis_label: 'Structure',
    analysis_text: 'Negative Adverb + Auxiliary + Subject + Main Verb',
    cta: 'View Similar Sentences →',
  },
  {
    tag: 'Participle Clause',
    sentence: '"Facing extreme gravitational forces, the crew had to rely on automated systems."',
    analysis_label: 'Logic',
    analysis_text: 'Cause and Effect. (Because they faced...)',
    cta: 'View Similar Sentences →',
  },
];

const FoundationPage: React.FC<FoundationPageProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'syntax'>('vocab');
  const [overview, setOverview] = useState<FoundationOverviewData | null>(null);

  useEffect(() => {
    let isMounted = true;
    getFoundationData()
      .then((data) => {
        if (isMounted) {
          setOverview(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load foundation data:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const panelClass = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'glass-panel border-white/60 text-[#1D1D1F]';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const memoryCurveData = overview?.memory_curve?.length ? overview.memory_curve : fallbackMemoryCurveData;
  const recentWords = overview?.recent_words?.length ? overview.recent_words : fallbackRecentWords;
  const syntaxEntries = overview?.syntax_entries?.length ? overview.syntax_entries : fallbackSyntaxEntries;

  const reviewCount = overview?.review_count ?? 42;

  const syntaxEntriesWithTimestamp = useMemo(() => {
    return syntaxEntries.map((entry) => {
      if (!entry.added_at) {
        return { ...entry, added_at: undefined };
      }
      return entry;
    });
  }, [syntaxEntries]);

  const formatAddedAt = (value?: string) => {
    if (!value) {
      return 'Added recently';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Added recently';
    }
    const diffMs = Date.now() - parsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return 'Added today';
    }
    if (diffDays === 1) {
      return 'Added yesterday';
    }
    return `Added ${diffDays} days ago`;
  };

  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
      <header className="mb-12 px-6 md:px-0">
        <h1 className="text-4xl font-bold tracking-tight mb-2 inherit flex items-center gap-3">
          <Database size={36} className="text-[#0071e3]" /> Core Systems (核心能力)
        </h1>
        <p className={`${textMuted} text-lg`}>Maintenance and calibration of linguistics database.</p>
      </header>

      {/* Toggle */}
      <div className="flex px-6 md:px-0 mb-8">
        <div className={`p-1 rounded-xl flex ${isDarkMode ? 'bg-white/10' : 'bg-white/50 border border-white/50'}`}>
          <button 
            onClick={() => setActiveTab('vocab')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'vocab' ? (isDarkMode ? 'bg-white text-black' : 'bg-white shadow-sm text-black') : 'opacity-60 hover:opacity-100'}`}
          >
            <Book size={16} /> 词汇数据库 (Vocab Bank)
          </button>
          <button 
            onClick={() => setActiveTab('syntax')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'syntax' ? (isDarkMode ? 'bg-white text-black' : 'bg-white shadow-sm text-black') : 'opacity-60 hover:opacity-100'}`}
          >
            <TrendingUp size={16} /> 长难句解析 (Syntax Parser)
          </button>
        </div>
      </div>

      {activeTab === 'vocab' && (
        <div className="grid grid-cols-12 gap-6 px-6 md:px-0 animate-in fade-in slide-in-from-bottom-4">
          {/* Memory Curve Chart */}
          <div className={`col-span-12 lg:col-span-8 rounded-[32px] p-8 ${panelClass} relative overflow-hidden`}>
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h3 className="font-bold text-lg mb-1">Ebbinghaus Retention Status</h3>
                 <p className="text-xs opacity-60 uppercase tracking-widest">Memory Decay Projection</p>
               </div>
               <div className="text-right">
                 <div className="text-3xl font-bold text-[#0071e3]">{reviewCount}</div>
                 <div className="text-xs opacity-60">Items for Review Today</div>
               </div>
             </div>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={memoryCurveData}>
                   <defs>
                     <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#666' : '#999', fontSize: 12}} />
                   <Tooltip contentStyle={{borderRadius: '12px', border: 'none', background: isDarkMode ? '#000' : '#fff'}} />
                   <Area type="monotone" dataKey="retention" stroke="#0071e3" strokeWidth={3} fill="url(#colorRetention)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className={`rounded-[32px] p-8 ${panelClass} flex flex-col justify-center items-center text-center group cursor-pointer hover:border-[#0071e3] transition-colors`}>
               <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-[#0071e3] mb-4 group-hover:scale-110 transition-transform">
                 <RefreshCw size={32} />
               </div>
               <h3 className="font-bold text-xl">Start Review</h3>
               <p className={`text-sm mt-2 ${textMuted}`}>42 words pending resonance check.</p>
            </div>
          </div>

          {/* Word List */}
           <div className="col-span-12">
            <h3 className={`text-sm font-bold opacity-60 uppercase tracking-widest mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent Acquisitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {recentWords.map((word, i) => (
                 <div key={word.word} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-white/60 shadow-sm'} flex justify-between items-center`}>
                    <div>
                      <div className="font-bold">{word.word}</div>
                      <div className="text-xs opacity-50">
                        {(word.part_of_speech || '—')} / {word.days_ago ?? 0} days ago
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'syntax' && (
        <div className="grid grid-cols-12 gap-6 px-6 md:px-0 animate-in fade-in slide-in-from-bottom-4">
           {/* Add New */}
           <div className={`col-span-12 p-8 rounded-[32px] border-dashed border-2 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-300 hover:bg-white/50'} flex flex-col items-center justify-center text-center cursor-pointer transition-all`}>
              <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center mb-4"><Plus /></div>
              <h3 className="font-bold">Add Long Sentence</h3>
              <p className={`text-sm ${textMuted}`}>Paste complex sentences here for AI structural breakdown.</p>
           </div>

           {/* Sentence Card */}
           {syntaxEntriesWithTimestamp.map((entry, index) => (
             <div key={`${entry.tag}-${index}`} className={`col-span-12 lg:col-span-6 p-8 rounded-[32px] ${panelClass}`}>
                <div className="flex justify-between items-start mb-4">
                   <span className={`text-xs font-bold px-2 py-1 rounded ${index % 2 === 0 ? 'bg-purple-500/10 text-purple-500' : 'bg-orange-500/10 text-orange-500'}`}>
                     {entry.tag}
                   </span>
                   <span className="text-xs opacity-50">{formatAddedAt(entry.added_at)}</span>
                </div>
                <p className="text-lg font-serif italic mb-6 leading-relaxed">{entry.sentence}</p>
                
                <div className="space-y-3">
                   <h4 className="text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} /> AI Analysis</h4>
                   <div className={`p-4 rounded-xl text-sm ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                      <span className="font-bold text-[#0071e3]">{entry.analysis_label}:</span> {entry.analysis_text}
                   </div>
                   <button className="text-xs font-bold text-[#0071e3] hover:underline">{entry.cta || 'View Similar Sentences →'}</button>
                </div>
             </div>
           ))}
        </div>
      )}

    </main>
  );
};

export default FoundationPage;
