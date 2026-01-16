import React from 'react';
import { Sparkles, ArrowRight, Brain, Target, Zap, Activity, Layers, PenTool, Mic, BookOpen, Headphones, Star } from 'lucide-react';
import LuminaAvatar from './LuminaAvatar';

interface IntroPageProps {
  onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto overflow-y-auto z-10 relative">
      <div className="max-w-6xl mx-auto space-y-20 pb-20">

        {/* Hero Section */}
        <section className="text-center pt-10 flex flex-col items-center">

          {/* THE AVATAR - Main Visual Centerpiece */}
          <div className="relative mb-12 group cursor-pointer" onClick={onStart}>
            <LuminaAvatar size="xl" state="idle" className="transform transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs font-mono text-orange-500 uppercase tracking-[0.3em]">点击开始</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Star size={16} className="text-[#0071e3] fill-[#0071e3]" />
            <span className="text-xs font-bold tracking-wide uppercase text-gray-600">学习的未来</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1] drop-shadow-sm max-w-4xl">
            Lumi AI
          </h1>
          <p className="mt-6 text-3xl md:text-4xl font-light text-gray-400 max-w-3xl leading-relaxed">
            重塑备考的<span className="text-[#1D1D1F] font-medium">深度诊断引擎</span>
          </p>

          <div className="pt-12">
            <button
              onClick={onStart}
              className="px-12 py-5 bg-black text-white rounded-full font-medium text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-orange-500/20 flex items-center gap-3 mx-auto relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-2">进入引力场 <ArrowRight size={22} /></span>
            </button>
          </div>
        </section>

        {/* Vision */}
        <section className="glass-panel p-10 rounded-[32px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 border border-white/60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0071e3] shadow-inner">
              <Brain size={28} />
            </div>
            <h2 className="text-3xl font-bold text-[#1D1D1F]">1. 项目愿景</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            在传统的雅思备考中，学生往往陷入“题海战术”，反复练习却难以突破瓶颈。Insight IELTS AI 的诞生，是为了终结这种盲目的无效努力。我们通过 AI 技术，将每一道错题转化为一次深度学习的机会。我们致力于打造雅思界的 "NotebookLM"，通过逻辑驱动的个性化诊断，让每一个考生的备考路径都精准、优雅且高效。
          </p>
        </section>

        {/* Problem & Solution Grid */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[32px] shadow-sm border border-white/50 hover:shadow-lg transition-all">
            <h3 className="text-2xl font-bold text-[#1D1D1F] mb-8 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-400 shadow-md shadow-red-200"></span> 现状痛点
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-5 group">
                <span className="text-gray-300 font-mono text-xl group-hover:text-red-400 transition-colors">01</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">错因模糊</h4>
                  <p className="text-gray-500 mt-2 leading-relaxed">学生知道选错，但不知是语法障碍、逻辑陷阱还是同义词替换失败。</p>
                </div>
              </li>
              <li className="flex gap-5 group">
                <span className="text-gray-300 font-mono text-xl group-hover:text-red-400 transition-colors">02</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">资料断层</h4>
                  <p className="text-gray-500 mt-2 leading-relaxed">模考工具只管打分，无法与高质量的教学解析无缝联动。</p>
                </div>
              </li>
              <li className="flex gap-5 group">
                <span className="text-gray-300 font-mono text-xl group-hover:text-red-400 transition-colors">03</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">学习孤岛</h4>
                  <p className="text-gray-500 mt-2 leading-relaxed">练习中的长难句和生词难以转化为长期的能力增长。</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#0071e3]/5 to-purple-50/20 backdrop-blur-md p-10 rounded-[32px] border border-white/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[80px] rounded-full pointer-events-none"></div>
            <h3 className="text-2xl font-bold text-[#0071e3] mb-8 flex items-center gap-3 relative z-10">
              <span className="w-3 h-3 rounded-full bg-[#0071e3] shadow-md shadow-blue-200"></span> 我们的解决方案
            </h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0071e3]"><Target size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">AI 错因指纹技术</h4>
                  <p className="text-gray-600 mt-2 leading-relaxed">自动识别定位词偏移、长难句理解错误、干扰项误导。</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0071e3]"><Layers size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">闭环学习生态</h4>
                  <p className="text-gray-600 mt-2 leading-relaxed">“诊断-解析-强化练习”的一站式体验。</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="mt-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#0071e3]"><Sparkles size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">原生极简交互</h4>
                  <p className="text-gray-600 mt-2 leading-relaxed">借鉴 Apple 设计哲学，去除冗余干扰，让学习回归内容本身。</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Core Features */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-[#1D1D1F]">3. 核心功能模块</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Activity size={24} />}
              color="indigo"
              title="AI 深度诊断系统"
              desc="不同于普通的评分工具，我们的 AI 会解析用户的答题轨迹。"
              points={['语法拆解：自动NLP拆解长难句。', '同义替换监测：识别 Synonym Matching 偏差。']}
            />
            <FeatureCard
              icon={<Zap size={24} />}
              color="green"
              title="智能错题闭环"
              desc="连对过关逻辑：生成变式题，直到连续答对。"
              points={['动态生成 3-5 道同逻辑变式题。', '个性化推荐：基于“弱点画像”调整顺序。']}
            />
            <FeatureCard
              icon={<BookOpen size={24} />}
              color="orange"
              title="浸入式阅读与听力"
              desc="点查生词库：即时释义、一键同步智能生词表。"
              points={['长难句高亮：AI 实时分析文本复杂度。', '辅助快速定位核心段落。']}
            />
            <FeatureCard
              icon={<Target size={24} />}
              color="pink"
              title="动态学情分析"
              desc="多维度能力图谱：词汇、语法、逻辑、速度。"
              points={['“学习脉搏”可视化图表。', 'B 端赋能：机构与家长报告模板。']}
            />
          </div>
        </section>

        {/* 4 Skills Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1D1D1F]">全科覆盖</h2>
            <p className="text-gray-500 mt-2 text-lg">听说读写，全方位 AI 赋能</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SkillCard icon={<Headphones size={32} />} title="听力" subtitle="精听纠错 & 语音识别" color="blue" />
            <SkillCard icon={<Mic size={32} />} title="口语" subtitle="AI 模拟考官 & 发音矫正" color="purple" />
            <SkillCard icon={<BookOpen size={32} />} title="阅读" subtitle="长难句拆解 & 逻辑高亮" color="amber" />
            <SkillCard icon={<PenTool size={32} />} title="写作" subtitle="逻辑润色 & 词汇升级" color="rose" />
          </div>
        </section>

        {/* Footer Info */}
        <section className="grid md:grid-cols-2 gap-12 pt-16 border-t border-gray-200/50">
          <div>
            <h4 className="font-bold text-[#1D1D1F] mb-6 text-xl">商业模式</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div>Freemium 模式：基础免费 + 会员深度诊断</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div>名师 IP 绑定：课程配套官方工具</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div>B 端授权：辅导机构数字化转型</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1D1D1F] mb-6 text-xl">设计理念</h4>
            <p className="text-gray-600 leading-relaxed">
              我们坚持 “Less is More”。采用液态玻璃质感、大圆角设计、SF Pro 字体。拒绝焦虑式的红字警告，用温和的色彩引导复盘。
            </p>
          </div>
        </section>

        <div className="text-center pt-16 pb-8 text-gray-400 text-sm">
          <p className="mb-2">Insight IELTS AI &copy; 2024</p>
          <p>让科技回归教育本质，让每一个进步都清晰可见。</p>
        </div>

      </div>
    </main>
  );
};

const FeatureCard = ({ icon, color, title, desc, points }: any) => (
  <div className="glass-panel p-8 rounded-[24px] hover:bg-white/90 transition-colors duration-300">
    <div className={`w-14 h-14 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
    <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
      {points.map((p: string, i: number) => <li key={i}>{p}</li>)}
    </ul>
  </div>
);

const SkillCard = ({ icon, title, subtitle, color }: any) => (
  <div className="bg-white/70 backdrop-blur-sm p-8 rounded-[24px] shadow-sm text-center group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/60">
    <div className={`mx-auto w-16 h-16 bg-${color}-50 text-${color}-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-${color}-500 group-hover:text-white transition-all duration-300 shadow-sm`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-xs text-gray-500 mt-2 font-medium">{subtitle}</p>
  </div>
);

export default IntroPage;