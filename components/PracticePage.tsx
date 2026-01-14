import React, { useState } from 'react';
import { Headphones, Mic, BookOpen, PenTool, Play, Clock, BarChart, ArrowLeft, X } from 'lucide-react';

const PracticePage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'listening' | 'speaking' | 'reading' | 'writing' | null>(null);

  // 如果有选中的模块，显示模拟考试界面（这里做了一个通用的模拟界面框架）
  if (activeModule) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F5F7] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
        {/* Exam Header */}
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveModule(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {activeModule === 'listening' && '听力真题模拟 (Listening)'}
              {activeModule === 'speaking' && '口语模考 (Speaking)'}
              {activeModule === 'reading' && '学术类阅读 (Reading)'}
              {activeModule === 'writing' && '写作真题 (Writing)'}
            </h2>
            <span className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium tracking-wide">TEST MODE</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-900 font-mono text-lg bg-gray-100 px-4 py-1.5 rounded-lg">
              <Clock size={18} className="text-[#0071e3]" />
              59:42
            </div>
            <button className="px-6 py-2 bg-[#0071e3] text-white rounded-full font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              交卷 (Submit)
            </button>
          </div>
        </div>

        {/* Exam Content Area - Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Material (PDF/Text/Audio) */}
          <div className="w-1/2 h-full border-r border-gray-200 bg-white p-8 overflow-y-auto">
             {activeModule === 'listening' && (
               <div className="flex flex-col items-center justify-center h-full space-y-8">
                 <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl animate-pulse"></div>
                    <Headphones size={64} className="text-[#0071e3] relative z-10" />
                 </div>
                 <div className="w-full max-w-md bg-gray-100 rounded-full h-12 flex items-center px-4 gap-4">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-black"><Play size={12} fill="currentColor" /></button>
                    <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-[#0071e3]"></div>
                    </div>
                    <span className="text-xs font-mono text-gray-500">12:30 / 30:00</span>
                 </div>
                 <p className="text-center text-gray-500 max-w-sm">Section 2: The History of Space Exploration. Please listen carefully and answer questions 11-20.</p>
               </div>
             )}

             {activeModule === 'reading' && (
               <div className="prose prose-lg max-w-none text-gray-800">
                 <h3 className="font-serif text-3xl mb-6">The Future of Interstellar Travel</h3>
                 <p>As humanity looks towards the stars, the challenges of interstellar travel remain daunting. The sheer distances involved are difficult to comprehend. The nearest star system, Alpha Centauri, is over 4 light-years away.</p>
                 <p>Current propulsion technologies, such as chemical rockets, would take tens of thousands of years to reach even our closest stellar neighbors. To bridge this gap, scientists are exploring revolutionary concepts like nuclear thermal propulsion, solar sails, and antimatter engines.</p>
                 <div className="my-6 p-4 bg-blue-50 border-l-4 border-[#0071e3] rounded-r-xl">
                   <p className="font-medium text-blue-900 m-0">Key Term: Time Dilation</p>
                   <p className="text-blue-800 text-sm m-0">A difference in the elapsed time measured by two observers, due to a velocity difference relative to each other or by being differently situated relative to a gravitational field.</p>
                 </div>
                 <p>Beyond propulsion, the human factor poses significant risks. Long-duration spaceflight exposes astronauts to cosmic radiation, muscle atrophy, and psychological stress. Creating a self-sustaining habitat for a multi-generational journey requires advancements in closed-loop life support systems.</p>
                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
               </div>
             )}

             {(activeModule === 'writing' || activeModule === 'speaking') && (
               <div className="space-y-6">
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Part 2 Topic</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe a technological innovation that you think is important.</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                      <li>What it is</li>
                      <li>How you use it</li>
                      <li>Why it is important</li>
                    </ul>
                 </div>
                 <div className="p-4 bg-blue-50/50 rounded-xl flex gap-3 items-start">
                    <div className="mt-1"><Clock size={16} className="text-[#0071e3]" /></div>
                    <p className="text-sm text-blue-800">AI Tip: Remember to use a variety of tenses (past, present perfect) when describing the history of the innovation.</p>
                 </div>
               </div>
             )}
          </div>

          {/* Right Panel: Questions/Input */}
          <div className="w-1/2 h-full bg-[#F9FAFB] p-8 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-6 sticky top-0 bg-[#F9FAFB] py-2 z-10 flex justify-between items-center">
              Questions 1-10
              <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">Fill in the blanks</span>
            </h3>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((q) => (
                <div key={q} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 hover:border-[#0071e3]/30 transition-colors">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-black text-white rounded text-sm font-bold flex-shrink-0">{q}</span>
                    <div className="flex-1 space-y-3">
                      <p className="text-gray-700">The primary challenge of reaching Alpha Centauri is the <span className="inline-block border-b-2 border-gray-300 w-32 mx-1"></span> involved.</p>
                      <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder-gray-400 text-sm" placeholder="Type your answer here..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 模块选择主界面
  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative">
      <header className="mb-12 px-6 md:px-0">
        <h1 className="text-4xl font-bold text-[#1D1D1F] tracking-tight mb-2">真题练习室</h1>
        <p className="text-gray-500 text-lg">选择科目，进入全真模拟考场。AI将全程跟踪诊断。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-0">
        <PracticeCard 
          title="听力 (Listening)" 
          subtitle="剑桥雅思 14-19 真题库"
          icon={<Headphones size={32} />}
          color="from-blue-500 to-cyan-500"
          stats="98 套试题"
          onClick={() => setActiveModule('listening')}
        />
        <PracticeCard 
          title="口语 (Speaking)" 
          subtitle="当季题库 AI 模考"
          icon={<Mic size={32} />}
          color="from-purple-500 to-pink-500"
          stats="56 个话题"
          onClick={() => setActiveModule('speaking')}
        />
        <PracticeCard 
          title="阅读 (Reading)" 
          subtitle="沉浸式长难句拆解"
          icon={<BookOpen size={32} />}
          color="from-amber-400 to-orange-500"
          stats="124 篇文章"
          onClick={() => setActiveModule('reading')}
        />
        <PracticeCard 
          title="写作 (Writing)" 
          subtitle="AI 实时批改润色"
          icon={<PenTool size={32} />}
          color="from-emerald-400 to-green-500"
          stats="各类图表/大作文"
          onClick={() => setActiveModule('writing')}
        />
      </div>

      {/* Recent History Section */}
      <div className="mt-16 px-6 md:px-0">
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">最近练习记录</h2>
        <div className="glass-panel rounded-[24px] overflow-hidden">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-6 border-b border-white/50 hover:bg-white/40 transition-colors cursor-pointer group">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                   <BarChart size={20} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900">Cambridge 18 - Test 2 - Reading</h3>
                   <p className="text-sm text-gray-500">2024年5月20日 • 用时 54min</p>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                 <div className="text-right">
                   <div className="text-xl font-bold text-gray-900">7.5</div>
                   <div className="text-xs text-gray-500 uppercase">Band Score</div>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0071e3] group-hover:text-[#0071e3]">
                   <ArrowLeft size={16} className="rotate-180" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

interface PracticeCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  stats: string;
  onClick: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ title, subtitle, icon, color, stats, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-[320px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 bg-white border border-white/60"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            {icon}
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
             <Play size={16} fill="currentColor" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#1D1D1F] mb-1 group-hover:translate-x-1 transition-transform">{title}</h3>
          <p className="text-gray-500 text-sm mb-4">{subtitle}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
            <BarChart size={12} />
            {stats}
          </div>
        </div>
      </div>

      {/* Decorative Blur blob */}
      <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    </div>
  );
};

export default PracticePage;