import React, { useEffect, useState } from 'react';
import { Clock, ArrowLeft, CheckCircle, AlertCircle, Play, Lock, BookOpen, PenTool, X, Zap, Sparkles, Shield, Infinity, Headphones, Mic, Brain, TrendingUp, Star, MessageSquare } from 'lucide-react';
import { AIDrill, PracticeModule, PracticeOverviewData, ReadingExamData } from '../types';
import { getPracticeData } from '../services/uiService';

const fallbackReadingExam: ReadingExamData = {
  title: 'The Impact of Climate Change on Obi',
  passage: `Roughly 11,700 years ago, as the most recent ice age ended, the climate became significantly warmer and wetter, no doubt making Obi's jungle much thicker. According to the researchers, it is no coincidence that around this time the first axes crafted from stone rather than sea shells appear, likely in response to their heavy-duty use for clearing and modification of the increasingly dense rainforest. While stone takes about twice as long to grind into an axe compared to shell, the harder material keeps its sharp edge for longer.`,
  question: {
    id: 4,
    text: "A change in the climate around 11,700 years ago had a greater impact on Obi than on the surrounding islands.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correct: "NOT GIVEN",
    analysis: "原文提到了11700年前气候变暖变湿让Obi的丛林变厚（making Obi's jungle much thicker），但并没有将Obi受到的影响与周围岛屿（surrounding islands）进行比较。题目中的比较关系在原文中不存在。",
    keywords: ["11,700 years ago", "Obi", "surrounding islands"]
  }
};

const fallbackAIDrills: AIDrill[] = [
  {
    source: "C19T4P1 - Q4",
    question: "Some species of butterfly have a reduced lifespan due to spring temperature increases.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    context: "In Britain, as the average spring temperature has increased by roughly 0.5 °C over the past 20 years, species have advanced by between three days and a week on average, to keep in line with cooler temperatures. Is this a sign that butterflies are well equipped to cope with climate change, and readily adjust to new temperatures? Or are these populations under stress, being dragged along unwillingly by unnaturally fast changes? The answer is still unknown, but a new study is seeking to answer these questions.",
    logic: "原文只提到了蝴蝶为了适应温度提前出现（advanced），并未提及寿命缩短（reduced lifespan）。属于典型的无中生有。",
    correct: "NOT GIVEN"
  },
  {
    source: "C19T2P1 - Q10",
    question: "Samuel Morse's communication system was more reliable than that developed by William Cooke and Charles Wheatstone.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    context: "The latter part of the Industrial Revolution also saw key advances in communication methods, as people increasingly saw the need to communicate efficiently over long distances. In 1837, British inventors William Cooke and Charles Wheatstone patented the first commercial telegraphy system. In the 1830s and 1840s, Samuel Morse and other inventors worked on their own versions in the United States. Cooke and Wheatstone's system was soon used for railway signalling in the UK. As the speed of the new locomotives increased, it was essential to have a fast and effective means of avoiding collisions.",
    logic: "原文提到了两人分别发明了系统，但完全没有比较两者的可靠性（more reliable）。",
    correct: "NOT GIVEN"
  }
];

const fallbackModules: PracticeModule[] = [
  {
    id: 'listening',
    title: 'Listening',
    subtitle: 'Cambridge 18 Test 4',
    tag: 'Section 4 Focus',
    color: 'bg-blue-100 text-blue-600',
    tag_color: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'reading',
    title: 'Reading',
    subtitle: 'C19 Test 3 Passage 1',
    tag: 'T/F/NG Special',
    color: 'bg-orange-100 text-orange-600',
    tag_color: 'bg-orange-100 text-orange-700',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'writing',
    title: 'Writing',
    subtitle: 'Task 2: Globalisation',
    tag: 'Argumentation',
    color: 'bg-purple-100 text-purple-600',
    tag_color: 'bg-purple-100 text-purple-700',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    id: 'speaking',
    title: 'Speaking',
    subtitle: 'Part 2: Technology',
    tag: 'Fluency Drill',
    color: 'bg-green-100 text-green-600',
    tag_color: 'bg-green-100 text-green-700',
    gradient: 'from-emerald-400 to-teal-500'
  }
];

const PracticePage: React.FC = () => {
  const [mode, setMode] = useState<'selection' | 'exam' | 'analysis'>('selection');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false); // Track subscription status
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({}); // Track user answers for drills
  const [drillsSubmitted, setDrillsSubmitted] = useState(false); // Track if drills are submitted
  const [drillsLoading, setDrillsLoading] = useState(false); // Track AI loading state for drills
  const [practiceData, setPracticeData] = useState<PracticeOverviewData | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPracticeData()
      .then((data) => {
        if (isMounted) {
          setPracticeData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load practice data:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const modules = practiceData?.modules?.length ? practiceData.modules : fallbackModules;
  const readingExam = practiceData?.reading_exam || fallbackReadingExam;
  const aiDrills = practiceData?.ai_drills?.length ? practiceData.ai_drills : fallbackAIDrills;

  const moduleIcons: Record<string, React.ReactNode> = {
    listening: <Headphones size={32} />,
    reading: <BookOpen size={32} />,
    writing: <PenTool size={32} />,
    speaking: <Mic size={32} />,
  };

  // Unlock Handler
  const handleUnlock = () => {
    setIsPremium(true);
    setShowPremiumModal(false);
    // Reset drill state when unlocking
    setDrillAnswers({});
    setDrillsSubmitted(false);
    setDrillsLoading(false);
  };

  // Handle exam submission with loading animation
  const handleExamSubmit = () => {
    setDrillsLoading(true);
    setMode('analysis');
    // Reset drill state
    setDrillAnswers({});
    setDrillsSubmitted(false);
    // Simulate AI loading for 2 seconds
    setTimeout(() => {
      setDrillsLoading(false);
    }, 3000);
  };

  // Handle drill answer selection
  const handleDrillAnswer = (drillIndex: number, answer: string) => {
    if (!drillsSubmitted) {
      setDrillAnswers(prev => ({ ...prev, [drillIndex]: answer }));
    }
  };

  // Handle drill submission
  const handleDrillSubmit = () => {
    setDrillsSubmitted(true);
  };

  const handleModuleClick = (id: string) => {
    if (id === 'reading') {
      setMode('exam');
    } else {
      alert("模块建设中：仅阅读模块 (Reading) 目前开放全真模拟。");
    }
  };

  // Selection Screen
  if (mode === 'selection') {
    return (
      <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative">
        <header className="mb-12 px-6 md:px-0">
          <h1 className="text-4xl font-bold tracking-tight mb-2 inherit">模拟舱</h1>
          <p className="text-gray-500 text-lg">选择一个模块开始标准化测试。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-0">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="group relative h-[320px] rounded-[32px] overflow-hidden cursor-pointer bg-white border border-gray-200 hover:shadow-xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                  {moduleIcons[module.id] || <BookOpen size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-transform">{module.title}</h3>
                  <p className="text-gray-500 mt-1">{module.subtitle}</p>
                  <div className={`mt-4 inline-block ${module.tag_color} text-xs font-bold px-3 py-1 rounded-full`}>
                    {module.tag}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Common Header for Exam/Analysis
  const Header = () => (
    <div className="h-16 bg-[#f0f2f5] border-b border-gray-300 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => setMode('selection')} className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><ArrowLeft size={20} /></button>
        <span className="font-bold text-gray-700">IELTS Academic Reading</span>
      </div>

      {mode === 'exam' ? (
        <div className="flex items-center gap-2 text-gray-900 font-mono text-xl font-bold bg-white px-4 py-1 rounded border border-gray-300 shadow-inner">
          <Clock size={20} className="text-red-500" />
          59:42
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-1 rounded border border-green-200">
          <CheckCircle size={20} /> 解析模式
        </div>
      )}

      <div>
        {mode === 'exam' ? (
          <button
            onClick={handleExamSubmit}
            className="px-6 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors"
          >
            提交
          </button>
        ) : (
          <button
            onClick={() => setMode('selection')}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-100 transition-colors"
          >
            退出
          </button>
        )}
      </div>
    </div>
  );

  const handleTextClick = () => {
    if (mode === 'analysis') {
      alert("已将该词加入生词本");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: TEXT */}
        <div className="w-1/2 h-full border-r-4 border-gray-200 bg-[#f9f9f9] p-8 overflow-y-auto selection:bg-yellow-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">{readingExam.title}</h2>
          <div className="prose prose-lg text-gray-800 leading-8">
            {readingExam.passage.split(' ').map((word, i) => (
              <span
                key={i}
                className={`cursor-pointer hover:bg-blue-100 rounded px-0.5 transition-colors ${highlights.includes(word) ? 'bg-yellow-200' : ''}`}
                onClick={handleTextClick}
                title={mode === 'analysis' ? "点击添加生词" : ""}
              >
                {word}{' '}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: QUESTIONS */}
        <div className="w-1/2 h-full bg-white p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
              <strong>Questions 1-4</strong><br />
              Do the following statements agree with the information given in Reading Passage 1?<br />
              In boxes 1-4 on your answer sheet, write<br />
              <strong>TRUE</strong> if the statement agrees with the information<br />
              <strong>FALSE</strong> if the statement contradicts the information<br />
              <strong>NOT GIVEN</strong> if there is no information on this
            </div>

            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-800 text-white flex items-center justify-center font-bold rounded">{readingExam.question.id}</span>
                <p className="text-lg text-gray-800 pt-1">{readingExam.question.text}</p>
              </div>

              {/* Options */}
              <div className="ml-12 space-y-3">
                {readingExam.question.options.map(opt => (
                  <label key={opt} className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${selectedAnswer === opt ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="q4"
                      value={opt}
                      checked={selectedAnswer === opt}
                      onChange={() => setSelectedAnswer(opt)}
                      disabled={mode === 'analysis'}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="font-bold text-gray-700">{opt}</span>
                    {mode === 'analysis' && opt === readingExam.question.correct && <CheckCircle size={20} className="text-green-500 ml-auto" />}
                    {mode === 'analysis' && selectedAnswer === opt && opt !== readingExam.question.correct && <AlertCircle size={20} className="text-red-500 ml-auto" />}
                  </label>
                ))}
              </div>
            </div>

            {/* ANALYSIS SECTION (Visible only in Analysis Mode) */}
            {mode === 'analysis' && (
              <div className="ml-12 animate-in fade-in slide-in-from-top-4">
                {/* 1. Basic Explanation */}
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl mb-6">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><CheckCircle size={16} /> 错因指纹分析</h4>
                  <p className="text-green-900 text-sm leading-relaxed">{readingExam.question.analysis}</p>
                </div>

                {/* 2. Video Analysis */}
                <div className="mb-6 relative group overflow-hidden rounded-xl border border-gray-200">
                  <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                    <h4 className="font-bold flex items-center gap-2"><Play size={16} /> 视频解析：名师精讲</h4>
                    {!isPremium && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">PREMIUM</span>}
                  </div>

                  {isPremium ? (
                    // Unlocked Video State
                    <div className="h-48 bg-black flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')] bg-cover opacity-50"></div>
                      <div className="z-10 text-center">
                        <button className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <Play size={32} className="text-white fill-white ml-1" />
                        </button>
                        <p className="text-white font-medium mt-2 text-sm">正在播放: 判断题“无中生有”陷阱...</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div className="h-full w-1/3 bg-red-500"></div>
                      </div>
                    </div>
                  ) : (
                    // Locked Video State
                    <div className="h-40 bg-gray-200 relative">
                      <div className="absolute inset-0 bg-cover bg-center blur-md scale-110" style={{ backgroundImage: 'url(https://picsum.photos/800/400)' }}></div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <button
                          onClick={() => setShowPremiumModal(true)}
                          className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                        >
                          <Lock size={16} /> 解锁完整视频解析
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. AI Targeted Drills */}
                <div className={`border rounded-xl p-6 relative overflow-hidden transition-all duration-500 ${isPremium ? 'border-purple-200 bg-white' : 'border-purple-200 bg-purple-50'}`}>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h4 className="font-bold text-purple-900 flex items-center gap-2"><PenTool size={16} /> AI 靶向变题</h4>
                    {isPremium && <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">已解锁</span>}
                  </div>

                  {drillsLoading ? (
                    // Loading Animation
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-purple-700 font-medium text-center">AI 正在根据错因检索生成相似例题...</p>
                      <p className="text-gray-400 text-xs mt-2">分析您的答题模式，匹配同源逻辑题目</p>
                    </div>
                  ) : isPremium ? (
                    // Unlocked Content - Interactive Quiz Mode
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-sm text-gray-600 mb-4">根据您的错因“Not Given 误判为 False”，AI 为您生成了以下 2 道同源逻辑变式题：</p>

                      {aiDrills.map((drill, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border transition-colors ${drillsSubmitted
                          ? (drillAnswers[idx] === drill.correct ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                          : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                          }`}>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400">{drill.source}</span>
                            {drillsSubmitted && (
                              <span className={`text-xs font-bold ${drillAnswers[idx] === drill.correct ? 'text-green-600' : 'text-red-600'}`}>
                                {drillAnswers[idx] === drill.correct ? '✓ 正确' : `✗ 正确答案: ${drill.correct}`}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800 mb-3 text-sm">{drill.question}</p>

                          {/* Context - Show before answering */}
                          <div className="text-xs text-gray-500 p-3 bg-white rounded border border-gray-100 mb-3 italic">
                            " {drill.context} "
                          </div>

                          {/* Answer Options */}
                          <div className="flex gap-2 mb-3">
                            {['TRUE', 'FALSE', 'NOT GIVEN'].map(option => (
                              <button
                                key={option}
                                onClick={() => handleDrillAnswer(idx, option)}
                                disabled={drillsSubmitted}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${drillAnswers[idx] === option
                                  ? drillsSubmitted
                                    ? option === drill.correct
                                      ? 'bg-green-500 text-white border-green-500'
                                      : 'bg-red-500 text-white border-red-500'
                                    : 'bg-purple-600 text-white border-purple-600'
                                  : drillsSubmitted && option === drill.correct
                                    ? 'bg-green-100 border-green-300 text-green-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                                  } ${drillsSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>

                          {/* AI Analysis - Only show after submission */}
                          {drillsSubmitted && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                              <div className="flex items-start gap-2 text-xs text-purple-700 bg-purple-50 p-2 rounded">
                                <Sparkles size={12} className="mt-0.5 flex-shrink-0" />
                                <span>{drill.logic}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Submit Button */}
                      {!drillsSubmitted ? (
                        <button
                          onClick={handleDrillSubmit}
                          disabled={Object.keys(drillAnswers).length < aiDrills.length}
                          className={`w-full py-3 rounded-full font-bold transition-all ${Object.keys(drillAnswers).length >= aiDrills.length
                            ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                          {Object.keys(drillAnswers).length >= aiDrills.length ? '提交答案' : `请完成所有题目 (${Object.keys(drillAnswers).length}/${aiDrills.length})`}
                        </button>
                      ) : (
                        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <p className="text-purple-700 font-medium">
                            得分: {aiDrills.filter((d, i) => drillAnswers[i] === d.correct).length} / {aiDrills.length}
                          </p>
                          <button
                            onClick={() => { setDrillAnswers({}); setDrillsSubmitted(false); }}
                            className="mt-2 text-sm text-purple-600 hover:underline"
                          >
                            重新做题
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Locked Content
                    <>
                      <p className="text-purple-800 text-sm mb-4 relative z-10">升级会员解锁 3 道基于“比较级缺失”逻辑的 AI 变式题，彻底修复此类漏洞。</p>
                      <div className="space-y-3 opacity-50 blur-[2px] select-none">
                        <div className="h-12 bg-white rounded border border-purple-100"></div>
                        <div className="h-12 bg-white rounded border border-purple-100"></div>
                        <div className="h-12 bg-white rounded border border-purple-100"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          onClick={() => setShowPremiumModal(true)}
                          className="px-5 py-2 bg-purple-600 text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                        >
                          <Lock size={14} /> 升级解锁 AI 变题
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PREMIUM SUBSCRIPTION MODAL --- */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-5xl h-[85vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">

            {/* Modal Close */}
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X size={24} className="text-gray-500" />
            </button>

            <div className="text-center pt-12 pb-8 px-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">升级套餐</h2>
              <p className="text-gray-500 mb-8">解锁 Lumina IELTS AI 全部功能，开启高效备考之旅</p>
            </div>

            {/* Pricing Cards */}
            <div className="flex-1 px-8 pb-12 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Free Plan */}
                <div className="rounded-[24px] p-8 border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold mb-2">免费版</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-500 text-sm">USD / 月</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">体验 Lumina 基础功能</p>
                  <button className="w-full py-3 rounded-full border border-gray-200 font-medium hover:bg-gray-50 mb-8 transition-colors">
                    你当前的套餐
                  </button>
                  <ul className="space-y-4 text-sm text-gray-600 flex-1">
                    <li className="flex gap-3"><CheckCircle size={18} className="text-green-500 flex-shrink-0" /> 7 天完整会员试用</li>
                    <li className="flex gap-3"><BookOpen size={18} className="flex-shrink-0" /> 模拟考试功能（无限制）</li>
                    <li className="flex gap-3"><X size={18} className="text-gray-300 flex-shrink-0" /> AI 错因深度诊断</li>
                    <li className="flex gap-3"><X size={18} className="text-gray-300 flex-shrink-0" /> 名师视频精讲解析</li>
                    <li className="flex gap-3"><X size={18} className="text-gray-300 flex-shrink-0" /> AI 靶向变题训练</li>
                    <li className="flex gap-3"><X size={18} className="text-gray-300 flex-shrink-0" /> 词汇与长难句数据库</li>
                    <li className="flex gap-3"><X size={18} className="text-gray-300 flex-shrink-0" /> 薄弱点智能修复</li>
                  </ul>
                </div>

                {/* Plus Plan */}
                <div className="rounded-[24px] p-8 border-2 border-indigo-100 bg-indigo-50/30 flex flex-col h-full relative hover:shadow-xl transition-shadow scale-105 shadow-lg">
                  <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">推荐</div>
                  <h3 className="text-2xl font-bold mb-2">Lumina Pro</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">$20</span>
                    <span className="text-gray-500 text-sm">USD / 月</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">解锁全部功能，高效突破雅思瓶颈</p>
                  <button
                    onClick={handleUnlock}
                    className="w-full py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 mb-8 shadow-md hover:shadow-lg transition-all"
                  >
                    升级 Pro 会员
                  </button>
                  <ul className="space-y-4 text-sm text-gray-700 flex-1">
                    <li className="flex gap-3"><Sparkles size={18} className="text-indigo-600 flex-shrink-0" /> 无限使用模拟考试</li>
                    <li className="flex gap-3"><Brain size={18} className="text-indigo-600 flex-shrink-0" /> AI 错因深度诊断（5大错因指纹）</li>
                    <li className="flex gap-3"><Play size={18} className="text-indigo-600 flex-shrink-0" /> 名师视频精讲解析</li>
                    <li className="flex gap-3"><PenTool size={18} className="text-indigo-600 flex-shrink-0" /> AI 靶向变题训练（同源逻辑变式）</li>
                    <li className="flex gap-3"><BookOpen size={18} className="text-indigo-600 flex-shrink-0" /> 完整词汇数据库 + 艾宾浩斯记忆</li>
                    <li className="flex gap-3"><TrendingUp size={18} className="text-indigo-600 flex-shrink-0" /> 长难句 AI 结构解析</li>
                    <li className="flex gap-3"><Zap size={18} className="text-indigo-600 flex-shrink-0" /> 薄弱点智能诊断与修复</li>
                    <li className="flex gap-3"><Star size={18} className="text-indigo-600 flex-shrink-0" /> 个性化学习报告与建议</li>
                    <li className="flex gap-3"><MessageSquare size={18} className="text-indigo-600 flex-shrink-0" /> 无限 Lumina AI 对话</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PracticePage;
