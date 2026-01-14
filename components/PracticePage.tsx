import React, { useState, useEffect } from 'react';
import { Headphones, Mic, BookOpen, PenTool, Play, Clock, BarChart, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getQuestions, getQuestionCount, createPracticeSession, submitAnswer, completePracticeSession, getPracticeHistory } from '../services/backendApi';

interface Question {
  id: number;
  category: string;
  question_type: string;
  difficulty: string;
  title: string;
  passage?: string;
  content: string;
  options?: string;
  answer: string;
  explanation?: string;
  source?: string;
}

interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  ai_analysis?: string;
  ai_correction?: string;
  error_type?: string;
}

interface PracticeHistory {
  id: number;
  category: string;
  title?: string;
  total_questions: number;
  correct_count: number;
  score?: number;
  started_at: string;
}

const PracticePage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'listening' | 'speaking' | 'reading' | 'writing' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [answerResults, setAnswerResults] = useState<{ [key: number]: AnswerResult }>({});
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionCounts, setQuestionCounts] = useState<{ [key: string]: number }>({});
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);
  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // 加载题目统计
  useEffect(() => {
    loadQuestionCounts();
    loadPracticeHistory();
  }, []);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeModule && !showResults) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeModule, showResults]);

  const loadQuestionCounts = async () => {
    try {
      const counts = await getQuestionCount();
      setQuestionCounts(counts);
    } catch (error) {
      console.error('Failed to load question counts:', error);
    }
  };

  const loadPracticeHistory = async () => {
    try {
      const history = await getPracticeHistory(5);
      setPracticeHistory(history);
    } catch (error) {
      console.error('Failed to load practice history:', error);
    }
  };

  const startPractice = async (category: 'listening' | 'speaking' | 'reading' | 'writing') => {
    setLoading(true);
    try {
      // 创建练习会话
      const session = await createPracticeSession(category, `${category.toUpperCase()} 练习`);
      setSessionId(session.id);

      // 获取该类别的题目
      const questionsData = await getQuestions(category, 5);
      setQuestions(questionsData);
      setActiveModule(category);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setAnswerResults({});
      setTimer(0);
      setShowResults(false);
    } catch (error) {
      console.error('Failed to start practice:', error);
      alert('启动练习失败，请确保后端服务正在运行');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswer = async (questionId: number) => {
    if (!sessionId || !userAnswers[questionId]) return;

    setSubmitting(true);
    try {
      const result = await submitAnswer(sessionId, questionId, userAnswers[questionId]);
      setAnswerResults(prev => ({ ...prev, [questionId]: result }));
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishPractice = async () => {
    if (!sessionId) return;

    try {
      await completePracticeSession(sessionId, timer);
      setShowResults(true);
      loadPracticeHistory();
    } catch (error) {
      console.error('Failed to complete practice:', error);
    }
  };

  const exitPractice = () => {
    setActiveModule(null);
    setQuestions([]);
    setSessionId(null);
    setShowResults(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalCorrect = Object.values(answerResults).filter((r: AnswerResult) => r.is_correct).length;

  // 练习模式界面
  if (activeModule && questions.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F5F7] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
        {/* Exam Header */}
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={exitPractice}
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
            <span className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium tracking-wide">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-900 font-mono text-lg bg-gray-100 px-4 py-1.5 rounded-lg">
              <Clock size={18} className="text-[#0071e3]" />
              {formatTime(timer)}
            </div>
            <button
              onClick={handleFinishPractice}
              className="px-6 py-2 bg-[#0071e3] text-white rounded-full font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              交卷 (Submit)
            </button>
          </div>
        </div>

        {/* Exam Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Passage */}
          <div className="w-1/2 h-full border-r border-gray-200 bg-white p-8 overflow-y-auto">
            {currentQuestion?.passage ? (
              <div className="prose prose-lg max-w-none text-gray-800">
                <h3 className="font-serif text-2xl mb-6">{currentQuestion.title}</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{currentQuestion.passage}</p>
                {currentQuestion.source && (
                  <p className="text-sm text-gray-400 mt-4">来源: {currentQuestion.source}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <BookOpen size={64} className="text-gray-300" />
                <p className="text-gray-500">此题目无阅读材料</p>
              </div>
            )}
          </div>

          {/* Right Panel: Questions */}
          <div className="w-1/2 h-full bg-[#F9FAFB] p-8 overflow-y-auto">
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all ${index === currentQuestionIndex
                    ? 'border-[#0071e3]'
                    : answerResults[q.id]
                      ? answerResults[q.id].is_correct
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-red-300 bg-red-50/50'
                      : 'border-gray-200/60'
                    }`}
                >
                  <div className="flex gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold flex-shrink-0 ${answerResults[q.id]
                      ? answerResults[q.id].is_correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-black text-white'
                      }`}>
                      {answerResults[q.id] ? (
                        answerResults[q.id].is_correct ? <CheckCircle size={16} /> : <XCircle size={16} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="flex-1 space-y-3">
                      <p className="text-gray-700 font-medium">{q.content}</p>

                      {/* 答案输入 */}
                      <input
                        type="text"
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        disabled={!!answerResults[q.id]}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all placeholder-gray-400 text-sm disabled:bg-gray-100"
                        placeholder="输入你的答案..."
                      />

                      {/* 提交按钮 */}
                      {!answerResults[q.id] && (
                        <button
                          onClick={() => handleSubmitAnswer(q.id)}
                          disabled={!userAnswers[q.id] || submitting}
                          className="px-4 py-2 bg-[#0071e3] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                          {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                          提交答案
                        </button>
                      )}

                      {/* 答案结果显示 */}
                      {answerResults[q.id] && (
                        <div className={`p-4 rounded-xl ${answerResults[q.id].is_correct ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className={`font-medium ${answerResults[q.id].is_correct ? 'text-green-700' : 'text-red-700'}`}>
                            {answerResults[q.id].is_correct ? '✓ 回答正确！' : '✗ 回答错误'}
                          </p>
                          {!answerResults[q.id].is_correct && (
                            <>
                              <p className="text-sm text-gray-600 mt-2">
                                正确答案：<span className="font-medium text-green-600">{answerResults[q.id].correct_answer}</span>
                              </p>
                              {answerResults[q.id].ai_analysis && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                  <p className="text-xs font-medium text-gray-500 mb-1">AI 分析</p>
                                  <p className="text-sm text-gray-700">{answerResults[q.id].ai_analysis}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 结果摘要 */}
            {showResults && (
              <div className="mt-8 p-6 bg-gradient-to-br from-[#0071e3] to-blue-600 rounded-2xl text-white">
                <h3 className="text-xl font-bold mb-4">练习完成！</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">{totalCorrect}/{questions.length}</p>
                    <p className="text-sm opacity-80">正确数</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{Math.round(totalCorrect / questions.length * 100)}%</p>
                    <p className="text-sm opacity-80">正确率</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{formatTime(timer)}</p>
                    <p className="text-sm opacity-80">用时</p>
                  </div>
                </div>
                <button
                  onClick={exitPractice}
                  className="mt-6 w-full py-3 bg-white text-[#0071e3] rounded-xl font-medium hover:bg-gray-100 transition-all"
                >
                  返回练习室
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 加载中状态
  if (loading) {
    return (
      <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-[#0071e3]" />
          <p className="text-gray-500">加载题目中...</p>
        </div>
      </main>
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
          subtitle="剑桥雅思真题库"
          icon={<Headphones size={32} />}
          color="from-blue-500 to-cyan-500"
          stats={`${questionCounts.listening || 0} 道题目`}
          onClick={() => startPractice('listening')}
        />
        <PracticeCard
          title="口语 (Speaking)"
          subtitle="当季题库 AI 模考"
          icon={<Mic size={32} />}
          color="from-purple-500 to-pink-500"
          stats={`${questionCounts.speaking || 0} 道题目`}
          onClick={() => startPractice('speaking')}
        />
        <PracticeCard
          title="阅读 (Reading)"
          subtitle="沉浸式长难句拆解"
          icon={<BookOpen size={32} />}
          color="from-amber-400 to-orange-500"
          stats={`${questionCounts.reading || 0} 道题目`}
          onClick={() => startPractice('reading')}
        />
        <PracticeCard
          title="写作 (Writing)"
          subtitle="AI 实时批改润色"
          icon={<PenTool size={32} />}
          color="from-emerald-400 to-green-500"
          stats={`${questionCounts.writing || 0} 道题目`}
          onClick={() => startPractice('writing')}
        />
      </div>

      {/* Recent History Section */}
      <div className="mt-16 px-6 md:px-0">
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">最近练习记录</h2>
        <div className="glass-panel rounded-[24px] overflow-hidden">
          {practiceHistory.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <BarChart size={48} className="mx-auto mb-4 opacity-30" />
              <p>暂无练习记录，开始你的第一次练习吧！</p>
            </div>
          ) : (
            practiceHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 border-b border-white/50 hover:bg-white/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                    <BarChart size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title || `${item.category.toUpperCase()} 练习`}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.started_at).toLocaleDateString('zh-CN')} •
                      正确 {item.correct_count}/{item.total_questions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{item.score?.toFixed(1) || '-'}</div>
                    <div className="text-xs text-gray-500 uppercase">Band Score</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0071e3] group-hover:text-[#0071e3]">
                    <ArrowLeft size={16} className="rotate-180" />
                  </div>
                </div>
              </div>
            ))
          )}
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