import React, { useState } from 'react';
import { Save, Shield, Cpu, Globe, Moon, Volume2, Key, Smartphone, ChevronRight } from 'lucide-react';

interface SettingsProps {
  settings?: {
    isDarkMode: boolean;
    showParticles: boolean;
    playNoise: boolean;
  };
  onSettingsChange?: (settings: any) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleSetting = (key: string) => {
    if (onSettingsChange && settings) {
      // @ts-ignore
      onSettingsChange({ [key]: !settings[key] });
    }
  };

  return (
    <main className="flex-1 min-h-screen pl-0 md:pl-24 pr-0 md:pr-8 py-8 md:py-10 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
      
      <header className="mb-12 px-6 md:px-0 relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2 inherit">控制中心 (Control Center)</h1>
        <p className="text-gray-500 text-lg">个性化您的学习引力场。</p>
      </header>

      <div className="grid grid-cols-12 gap-8 px-6 md:px-0 relative z-10">
        
        {/* Left Column: Navigation/Categories */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className={`p-2 rounded-[24px] border ${settings?.isDarkMode ? 'bg-white/5 border-white/10' : 'glass-panel border-white/60'}`}>
            <SettingsNavItem icon={<Cpu size={20} />} label="通用设置 (General)" active isDarkMode={settings?.isDarkMode} />
            <SettingsNavItem icon={<Key size={20} />} label="API 配置 (Connections)" isDarkMode={settings?.isDarkMode} />
            <SettingsNavItem icon={<Shield size={20} />} label="隐私与安全 (Privacy)" isDarkMode={settings?.isDarkMode} />
            <SettingsNavItem icon={<Volume2 size={20} />} label="声音与触感 (Haptics)" isDarkMode={settings?.isDarkMode} />
          </div>

          <div className="p-6 rounded-[24px] bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden group cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-[40px] group-hover:bg-blue-500/50 transition-colors duration-500"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Lumina Pro</h3>
              <p className="text-gray-400 text-sm mb-4">解锁无限流 Deep Space 题库。</p>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                立即升级
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* AI Model Config Section */}
          <section className={`p-8 rounded-[32px] border shadow-sm relative overflow-hidden ${settings?.isDarkMode ? 'bg-white/5 border-white/10' : 'glass-panel border-white/60'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Cpu size={120} />
             </div>

             <div className="relative z-10">
               <h2 className="text-xl font-bold inherit mb-6 flex items-center gap-2">
                 <Key size={20} className="text-[#0071e3]" />
                 模型接入配置 (Model Gateway)
               </h2>

               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium opacity-70 mb-2 ml-1">
                     DeepSeek API Key
                   </label>
                   <div className="relative group">
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                     <input 
                       type="password" 
                       value={deepSeekKey}
                       onChange={(e) => setDeepSeekKey(e.target.value)}
                       placeholder="sk-..."
                       className={`relative w-full backdrop-blur-md border rounded-2xl px-5 py-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-mono text-sm
                         ${settings?.isDarkMode ? 'bg-white/10 border-white/10 text-white focus:border-white/30' : 'bg-white/50 border-gray-200 text-gray-900 focus:border-[#0071e3]/50'}
                       `}
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <span className="text-[10px] font-bold bg-gray-100/10 text-gray-500 px-2 py-1 rounded-md border border-gray-200/20">ENCRYPTED</span>
                     </div>
                   </div>
                   <p className="mt-2 text-xs text-gray-500 ml-1">
                     我们将使用此 Key 来驱动 "Deep Insight" 深度推理引擎。密钥仅存储在本地浏览器中。
                   </p>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-gray-100/10">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${deepSeekKey ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     <span className="text-sm opacity-60">状态: {deepSeekKey ? '已就绪 (Ready)' : '未配置 (Not Configured)'}</span>
                   </div>
                   <button 
                     onClick={handleSave}
                     className={`px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2
                       ${settings?.isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1D1D1F] text-white'}
                     `}
                   >
                     {isSaved ? '已保存' : '保存配置'} 
                     {!isSaved && <Save size={16} />}
                   </button>
                 </div>
               </div>
             </div>
          </section>

          {/* Preferences Section */}
          <section className={`p-8 rounded-[32px] border shadow-sm ${settings?.isDarkMode ? 'bg-white/5 border-white/10' : 'glass-panel border-white/60'}`}>
             <h2 className="text-xl font-bold inherit mb-6 flex items-center gap-2">
               <Smartphone size={20} className="text-purple-600" />
               界面与沉浸感 (Immersion)
             </h2>
             
             <div className="space-y-4">
               <ToggleItem 
                 icon={<Moon size={18} />}
                 label="星际深色模式 (Interstellar Dark Mode)"
                 description="启用更深邃的宇宙背景，适合夜间专注。"
                 checked={settings?.isDarkMode}
                 onChange={() => toggleSetting('isDarkMode')}
                 isDarkMode={settings?.isDarkMode}
               />
               <ToggleItem 
                 icon={<Globe size={18} />}
                 label="动态粒子效果 (Dynamic Particles)"
                 description="在背景中渲染实时重力粒子流。"
                 checked={settings?.showParticles}
                 onChange={() => toggleSetting('showParticles')}
                 isDarkMode={settings?.isDarkMode}
               />
               <ToggleItem 
                 icon={<Volume2 size={18} />}
                 label="环境白噪音 (Ambient Noise)"
                 description="播放‘太空舱’或‘图书馆’白噪音以助专注。"
                 checked={settings?.playNoise}
                 onChange={() => toggleSetting('playNoise')}
                 isDarkMode={settings?.isDarkMode}
               />
             </div>
          </section>

        </div>
      </div>
    </main>
  );
};

const SettingsNavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; isDarkMode?: boolean }> = ({ icon, label, active, isDarkMode }) => (
  <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 
    ${active 
       ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-[#1D1D1F] shadow-sm') 
       : 'opacity-60 hover:opacity-100 hover:bg-white/5'
    }
  `}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {active && <ChevronRight size={16} className="opacity-50" />}
  </button>
);

const ToggleItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  description: string; 
  checked?: boolean; 
  onChange: () => void;
  isDarkMode?: boolean;
}> = ({ icon, label, description, checked, onChange, isDarkMode }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors
      ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-white/50 hover:bg-white/60'}
    `}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg shadow-sm ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white text-gray-700'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold inherit text-sm">{label}</h4>
          <p className="text-xs opacity-60">{description}</p>
        </div>
      </div>
      <button 
        onClick={onChange}
        className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${checked ? 'bg-[#0071e3]' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );
}

export default SettingsPage;