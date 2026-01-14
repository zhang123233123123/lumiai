import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Sparkles, Brain, AlertCircle, RefreshCw, FileText, ChevronRight, Star, Clock, Target, TrendingUp, Activity, Radio, Orbit, Loader2 } from 'lucide-react';
import { getErrors, getSkillScores, getLearningStats, getAIImprovements, generateSimilarQuestion } from '../services/backendApi';

interface AnalysisPageProps {
    isDarkMode?: boolean;
}

// 错题接口
interface ErrorItem {
    id: number;
    question_id: number;
    error_type: string;
    title: string;
    source?: string;
    content: string;
    user_answer: string;
    correct_answer: string;
    ai_analysis?: string;
    ai_correction?: string;
    created_at: string;
}

// 默认错题数据（后备）
const defaultErrors: ErrorItem[] = [
    {
        id: 1, question_id: 1, error_type: 'grammar', title: 'Relativity Syntax Error',
        source: 'Cambridge 15 - Test 3 - Writing Task 2',
        content: 'The number of students who studies abroad has increased.',
        user_answer: 'studies', correct_answer: 'study',
        ai_analysis: '在 "who" 引导的定语从句中，谓语动词应与先行词 "students" (复数) 保持一致。',
        ai_correction: 'The number of students who study abroad has increased.',
        created_at: new Date().toISOString()
    }
];

const AnalysisPage: React.FC<AnalysisPageProps> = ({ isDarkMode }) => {
    const [errors, setErrors] = useState<ErrorItem[]>(defaultErrors);
    const [selectedError, setSelectedError] = useState<ErrorItem | null>(null);
    const [activeTab, setActiveTab] = useState<'diagnosis' | 'stats'>('diagnosis');
    const [isGenerating, setIsGenerating] = useState(false);
    const [variantQuestion, setVariantQuestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [skillData, setSkillData] = useState<any[]>([]);
    const [timeData, setTimeData] = useState<any[]>([]);
    const [accuracyData, setAccuracyData] = useState<any[]>([]);
    const [improvements, setImprovements] = useState<any[]>([]);

    // 加载数据
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            // 并行加载所有数据
            const [errorsData, skillsData, statsData, improvementsData] = await Promise.all([
                getErrors(10).catch(() => defaultErrors),
                getSkillScores().catch(() => ({ skills: [] })),
                getLearningStats().catch(() => ({ time_stats: [], accuracy_stats: [] })),
                getAIImprovements().catch(() => [])
            ]);

            // 设置错题
            if (errorsData && errorsData.length > 0) {
                setErrors(errorsData);
                setSelectedError(errorsData[0]);
            } else {
                setErrors(defaultErrors);
                setSelectedError(defaultErrors[0]);
            }

            // 设置技能数据
            if (skillsData.skills && skillsData.skills.length > 0) {
                setSkillData(skillsData.skills.map((s: any) => ({
                    subject: `${s.name_cn} (${s.name})`,
                    A: s.score,
                    fullMark: s.full_mark
                })));
            } else {
                setSkillData([
                    { subject: '词汇 (Vocab)', A: 120, fullMark: 150 },
                    { subject: '语法 (Grammar)', A: 98, fullMark: 150 },
                    { subject: '逻辑 (Logic)', A: 86, fullMark: 150 },
                    { subject: '发音 (Pron)', A: 99, fullMark: 150 },
                    { subject: '流利度 (Fluency)', A: 85, fullMark: 150 },
                    { subject: '连贯性 (Coherence)', A: 65, fullMark: 150 },
                ]);
            }

            // 设置时间统计
            if (statsData.time_stats && statsData.time_stats.length > 0) {
                setTimeData(statsData.time_stats.map((t: any) => ({
                    name: t.category,
                    hours: t.hours
                })));
            } else {
                setTimeData([
                    { name: 'Listening', hours: 12.5 },
                    { name: 'Reading', hours: 15.2 },
                    { name: 'Writing', hours: 8.4 },
                    { name: 'Speaking', hours: 5.1 },
                ]);
            }

            // 设置正确率
            if (statsData.accuracy_stats && statsData.accuracy_stats.length > 0) {
                setAccuracyData(statsData.accuracy_stats.map((a: any) => ({
                    name: a.category,
                    accuracy: a.accuracy
                })));
            } else {
                setAccuracyData([
                    { name: 'Listening', accuracy: 85 },
                    { name: 'Reading', accuracy: 78 },
                    { name: 'Writing', accuracy: 65 },
                    { name: 'Speaking', accuracy: 72 },
                ]);
            }

            // 设置改进建议
            setImprovements(improvementsData.length > 0 ? improvementsData : [
                { category: 'Reading', title: 'Reading Velocity', description: 'Reading speed is lagging. Focus on core signal words.', priority: 'high' },
                { category: 'Listening', title: 'Listening Precision', description: 'Section 4 Plural forms failure detected.', priority: 'medium' },
                { category: 'Speaking', title: 'Speaking Fluency', description: 'Deploy filler words to maintain communication.', priority: 'low' },
            ]);

        } catch (error) {
            console.error('Failed to load analysis data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!selectedError) return;
        setIsGenerating(true);
        setVariantQuestion(null);

        try {
            const result = await generateSimilarQuestion(selectedError.id);
            setVariantQuestion(result.similar_question || '生成失败，请重试');
        } catch (error) {
            console.error('Failed to generate similar question:', error);
            setVariantQuestion('生成失败，请确保后端服务正在运行。');
        } finally {
            setIsGenerating(false);
        }
    };

    const panelClass = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/60 border-white/60 text-[#1D1D1F]';
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
    const chartStroke = isDarkMode ? '#888' : '#333';
    const gridStroke = isDarkMode ? '#333' : '#eee';
    const tooltipBg = isDarkMode ? '#1a1a1a' : '#fff';

    return (
        <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">

            <header className="mb-8 px-6 md:px-0 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg shadow-lg ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            <Activity size={20} />
                        </div>
                        <h1 className="text-3xl font-bold inherit tracking-tight">Endurance Telemetry (学情分析)</h1>
                    </div>
                    <p className={textSecondary}>Quantum-driven diagnostics & Trajectory planning</p>
                </div>

                {/* Tab Switcher */}
                <div className={`p-1 rounded-xl flex ${isDarkMode ? 'bg-white/10' : 'bg-white/50 border border-white/50'}`}>
                    <button
                        onClick={() => setActiveTab('diagnosis')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'diagnosis' ? (isDarkMode ? 'bg-white text-black' : 'bg-white shadow-sm text-black') : 'opacity-60 hover:opacity-100'}`}
                    >
                        <Brain size={16} /> System Diagnostics
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'stats' ? (isDarkMode ? 'bg-white text-black' : 'bg-white shadow-sm text-black') : 'opacity-60 hover:opacity-100'}`}
                    >
                        <Orbit size={16} /> Flight Data
                    </button>
                </div>
            </header>

            {activeTab === 'stats' ? (
                /* --- STATISTICS VIEW --- */
                <div className="grid grid-cols-12 gap-6 px-6 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Time Spent Chart */}
                    <div className={`col-span-12 md:col-span-6 rounded-[32px] p-8 backdrop-blur-xl border shadow-sm ${panelClass}`}>
                        <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={16} className="text-[#0071e3]" /> Time Dilation Log (Hours Spent)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke={chartStroke} axisLine={false} tickLine={false} />
                                    <YAxis stroke={chartStroke} axisLine={false} tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: tooltipBg, color: isDarkMode ? '#fff' : '#000' }} />
                                    <Area type="monotone" dataKey="hours" stroke="#0071e3" fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Accuracy Chart */}
                    <div className={`col-span-12 md:col-span-6 rounded-[32px] p-8 backdrop-blur-xl border shadow-sm ${panelClass}`}>
                        <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target size={16} className="text-green-500" /> Orbital Alignment (Accuracy %)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={accuracyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                    <XAxis dataKey="name" stroke={chartStroke} axisLine={false} tickLine={false} />
                                    <YAxis stroke={chartStroke} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', background: tooltipBg, color: isDarkMode ? '#fff' : '#000' }} />
                                    <Bar dataKey="accuracy" fill="#34c759" radius={[8, 8, 0, 0]} barSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Improvement Suggestions */}
                    <div className={`col-span-12 rounded-[32px] p-8 backdrop-blur-xl border shadow-sm relative overflow-hidden ${panelClass}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                        <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                            <TrendingUp size={16} className="text-purple-400" /> Gravity Assist Protocol (Suggestions)
                        </h3>

                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                            <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/50'} border border-white/10 hover:border-purple-500/30 transition-colors`}>
                                <h4 className="font-bold text-lg mb-2 text-purple-400 flex items-center gap-2"><Radio size={16} /> Reading Velocity</h4>
                                <p className="text-sm opacity-80 leading-relaxed">Reading speed is lagging. Engage "Parallel Reading Strategy" to bypass data noise and focus on core signal words.</p>
                            </div>
                            <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/50'} border border-white/10 hover:border-blue-500/30 transition-colors`}>
                                <h4 className="font-bold text-lg mb-2 text-blue-400 flex items-center gap-2"><Orbit size={16} /> Listening Precision</h4>
                                <p className="text-sm opacity-80 leading-relaxed">Section 4 Plural forms failure detected (30% loss). Calibrate sensors for suffix 's' detection in high-speed audio streams.</p>
                            </div>
                            <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/50'} border border-white/10 hover:border-green-500/30 transition-colors`}>
                                <h4 className="font-bold text-lg mb-2 text-green-400 flex items-center gap-2"><Activity size={16} /> Speaking Fluency</h4>
                                <p className="text-sm opacity-80 leading-relaxed">High lexical resource, but hesitation anomalies detected. Deploy filler words (e.g., "Well", "Actually") to maintain communication link.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- DIAGNOSIS VIEW (Existing) --- */
                <div className="grid grid-cols-12 gap-6 px-6 md:px-0 h-[calc(100vh-180px)] min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Left Column: Radar & Error List */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
                        {/* Radar Chart Card */}
                        <div className={`backdrop-blur-xl border rounded-[32px] p-6 shadow-sm relative overflow-hidden group ${panelClass}`}>
                            {/* Cosmic shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Radar size={16} /> Capability Event Horizon
                            </h3>
                            <div className="h-[250px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                        <PolarGrid stroke={isDarkMode ? '#444' : '#e5e7eb'} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#888' : '#6b7280', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar
                                            name="My Skill"
                                            dataKey="A"
                                            stroke="#0071e3"
                                            strokeWidth={3}
                                            fill="#0071e3"
                                            fillOpacity={0.2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Error Notebook List */}
                        <div className={`flex-1 backdrop-blur-xl border rounded-[32px] p-6 shadow-sm flex flex-col overflow-hidden ${panelClass}`}>
                            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2 font-bold"><Brain size={16} /> Anomaly Archive (Black Box)</span>
                                <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-mono">3 NEW</span>
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {errors.map((err) => (
                                    <div
                                        key={err.id}
                                        onClick={() => { setSelectedError(err); setVariantQuestion(null); }}
                                        className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 group relative overflow-hidden
                                      ${selectedError?.id === err.id
                                                ? (isDarkMode ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-black text-white border-black shadow-lg shadow-blue-900/20')
                                                : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/10'
                                            }
                                  `}
                                    >
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider font-mono
                                          ${selectedError?.id === err.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'}
                                      `}>
                                                {err.error_type}
                                            </span>
                                            <ChevronRight size={16} className={`transition-transform duration-300 ${selectedError?.id === err.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                        </div>
                                        <h4 className="font-bold text-sm mb-1 relative z-10">{err.title}</h4>
                                        <p className={`text-xs line-clamp-2 relative z-10 ${selectedError?.id === err.id ? 'opacity-70' : 'opacity-50'}`}>
                                            {err.source}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Deep Insight (NotebookLM Style) */}
                    <div className="col-span-12 lg:col-span-8 h-full">
                        <div className={`h-full backdrop-blur-2xl border rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/50'}`}>
                            {/* Glass sheen */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

                            {/* Header Area */}
                            <div className="relative z-10 flex justify-between items-start mb-8 border-b border-gray-200/10 pb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={18} className="text-[#0071e3] animate-pulse" />
                                        <span className="text-[#0071e3] font-bold text-sm uppercase tracking-wide">TARS Insight Engine (AI 深度洞察)</span>
                                    </div>
                                    <h2 className="text-3xl font-bold inherit">{selectedError?.title || '未选择错题'}</h2>
                                    <p className="opacity-60 mt-2 font-mono text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        Source: {selectedError?.source || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className={`p-3 rounded-full shadow-sm hover:scale-110 transition-transform hover:text-[#0071e3] ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'}`}><Star size={20} /></button>
                                    <button className={`p-3 rounded-full shadow-sm hover:scale-110 transition-transform hover:text-[#0071e3] ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'}`}><FileText size={20} /></button>
                                </div>
                            </div>

                            {/* Content Area - Notebook Style */}
                            <div className="relative z-10 flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">

                                {/* The Mistake */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle size={14} /> Data Corruption (Original Mistake)
                                    </h3>
                                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500/90 font-serif text-lg leading-relaxed shadow-sm">
                                        "{selectedError?.content || '请选择一道错题查看详情'}"
                                    </div>
                                </div>

                                {/* The Correction & Insight */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">Trajectory Correction (Analysis)</h3>
                                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600/90 font-medium shadow-sm h-full">
                                            {selectedError?.ai_correction || selectedError?.correct_answer || '暂无纠正建议'}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">Quantum Diagnosis (AI Reason)</h3>
                                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-600/90 text-sm leading-relaxed shadow-sm h-full">
                                            {selectedError?.ai_analysis || '暂无AI分析'}
                                        </div>
                                    </div>
                                </div>

                                {/* Variable Question Generation Section */}
                                <div className="pt-8 border-t border-gray-200/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold inherit flex items-center gap-2">
                                            <RefreshCw size={20} className={isGenerating ? "animate-spin text-[#0071e3]" : "opacity-40"} />
                                            Lazarus Simulation (New Questions)
                                        </h3>
                                        {!variantQuestion && !isGenerating && (
                                            <button
                                                onClick={handleGenerate}
                                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 group
                                            ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
                                          `}
                                            >
                                                <Sparkles size={14} className="group-hover:animate-pulse" /> Initiate Simulation
                                            </button>
                                        )}
                                    </div>

                                    {isGenerating && (
                                        <div className={`h-40 flex flex-col items-center justify-center gap-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white/30 border-white/50 text-gray-400'}`}>
                                            <div className="w-10 h-10 border-4 border-[#0071e3]/20 border-t-[#0071e3] rounded-full animate-spin"></div>
                                            <span className="text-xs tracking-[0.2em] uppercase font-medium">Computing Logic Pattern...</span>
                                        </div>
                                    )}

                                    {variantQuestion && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="p-8 bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden group">
                                                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] group-hover:bg-blue-500/30 transition-colors duration-1000"></div>
                                                <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] group-hover:bg-purple-500/30 transition-colors duration-1000"></div>

                                                <div className="relative z-10 whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-200">
                                                    {variantQuestion}
                                                </div>

                                                <div className="mt-8 flex justify-end gap-3 relative z-10">
                                                    <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm backdrop-blur-md transition-colors border border-white/10">Decrypt Answer</button>
                                                    <button onClick={handleGenerate} className="px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ED] text-white text-sm shadow-lg transition-colors font-medium">Re-run Sim</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AnalysisPage;