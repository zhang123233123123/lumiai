import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, Mic } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { Message } from '../types';
import LuminaAvatar from './LuminaAvatar';

const AITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'model',
      text: 'Lumina 系统已就绪。检测到您的雅思备考轨迹，随时可以开始深度诊断。',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 1. Floating Trigger Button (The Mini Black Hole)
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full cursor-pointer z-[100] group transition-transform duration-500 hover:scale-110 active:scale-95"
      >
        <LuminaAvatar size="md" className="w-full h-full" state="idle" />
        
        {/* Tooltip HUD */}
        <div className="absolute -top-12 right-0 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
           <span className="text-xs font-mono text-orange-300 tracking-widest uppercase">Lumina Online</span>
        </div>
      </button>
    );
  }

  // 2. Main Chat Interface (Sci-Fi HUD Style)
  return (
    <div className={`fixed z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col overflow-hidden
      ${isExpanded ? 'inset-4 rounded-[32px]' : 'bottom-8 right-8 w-[400px] h-[650px] rounded-[32px]'}
      bg-black/60 backdrop-blur-[40px] border border-white/20 shadow-2xl ring-1 ring-white/10
    `}>
      
      {/* HUD Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent relative overflow-hidden">
        {/* Scanning line effect */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        
        <div className="flex items-center gap-4">
            <LuminaAvatar size="sm" state={isLoading ? 'thinking' : 'idle'} />
            <div>
                <h3 className="font-bold text-white tracking-wide text-lg">Lumina AI</h3>
                <p className="text-[10px] text-orange-300/80 font-mono tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Singularity Connected
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><Maximize2 size={16} /></button>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'model' && (
               <div className="mr-3 mt-1 opacity-80 hidden sm:block">
                 <LuminaAvatar size="sm" className="w-8 h-8" />
               </div>
            )}
            <div className={`
              max-w-[85%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-lg backdrop-blur-md border
              ${msg.role === 'user' 
                ? 'bg-[#0071e3]/80 text-white rounded-tr-sm border-[#0071e3]' 
                : 'bg-white/10 text-gray-100 rounded-tl-sm border-white/10'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex w-full justify-start relative z-10">
             <div className="ml-11 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                <span className="text-xs text-orange-300 font-mono animate-pulse">Computing...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-black/40 border-t border-white/10 backdrop-blur-xl">
        <div className="relative flex items-center bg-white/5 rounded-[24px] border border-white/10 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="向 Lumina 提问..."
            className="flex-1 bg-transparent border-none py-4 pl-6 pr-14 focus:ring-0 text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-1">
             <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Mic size={18} />
             </button>
             <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 text-white hover:shadow-[0_0_15px_rgba(255,165,0,0.5)] disabled:opacity-50 disabled:shadow-none transition-all transform hover:scale-105 active:scale-95"
              >
                <Send size={16} fill="currentColor" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;