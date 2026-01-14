import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IntroPage from './components/IntroPage';
import PracticePage from './components/PracticePage';
import AnalysisPage from './components/AnalysisPage';
import SettingsPage from './components/SettingsPage';
import FoundationPage from './components/FoundationPage';
import WeaknessPage from './components/WeaknessPage';
import AITutor from './components/AITutor';
import ParticleBackground from './components/ParticleBackground';

export type ViewState = 'intro' | 'dashboard' | 'practice' | 'analysis' | 'settings' | 'foundation' | 'weakness';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('intro');
  
  // Global Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [playNoise, setPlayNoise] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (playNoise) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playNoise]);

  // Apply dark mode styles to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-1000 relative font-sans overflow-x-hidden
      ${isDarkMode ? 'bg-[#050505] text-white selection:bg-orange-500' : 'bg-[#F5F5F7] text-[#1D1D1F] selection:bg-[#0071e3] selection:text-white'}
    `}>
      
      {/* --- CINEMATIC LAYER --- */}
      
      {/* 1. Film Grain Overlay (Texture) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 2. Deep Space Gradient Base */}
      <div className={`fixed inset-0 transition-opacity duration-1000 z-0
         ${isDarkMode 
           ? 'bg-gradient-to-b from-[#000000] via-[#0B0B0C] to-[#151515]' 
           : 'bg-gradient-to-b from-[#F5F5F7] via-[#E8E8ED] to-[#D1D1D6]'
         }
      `}></div>

      {/* 3. The "Gargantua" Light Leak (Top Left) */}
      <div className={`fixed top-[-300px] left-[-200px] w-[800px] h-[800px] rounded-full blur-[150px] z-0 animate-pulse-slow transition-colors duration-1000
         ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent' : 'bg-gradient-to-br from-blue-400/20 via-indigo-300/10 to-transparent'}
      `}></div>

      {/* 4. The "Accretion" Warmth (Bottom Right) */}
      <div className={`fixed bottom-[-300px] right-[-200px] w-[900px] h-[900px] rounded-full blur-[150px] z-0 transition-colors duration-1000
         ${isDarkMode ? 'bg-gradient-to-tl from-orange-900/10 via-red-900/5 to-transparent' : 'bg-gradient-to-tl from-orange-300/10 via-amber-100/10 to-transparent'}
      `}></div>

      {/* 5. Dynamic Particles */}
      {showParticles && <ParticleBackground isDarkMode={isDarkMode} />}

      {/* 6. Audio Element for White Noise */}
      <audio ref={audioRef} loop src="https://assets.mixkit.co/sfx/preview/mixkit-space-ship-hum-2136.mp3" />

      {/* --- APP CONTENT --- */}
      <div className="flex relative z-10">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
        />
        
        {/* View Switcher */}
        {currentView === 'intro' && <IntroPage onStart={() => setCurrentView('dashboard')} />}
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'practice' && <PracticePage />}
        {currentView === 'analysis' && <AnalysisPage isDarkMode={isDarkMode} />}
        {currentView === 'foundation' && <FoundationPage isDarkMode={isDarkMode} />}
        {currentView === 'weakness' && <WeaknessPage isDarkMode={isDarkMode} />}
        {currentView === 'settings' && (
          <SettingsPage 
            settings={{ isDarkMode, showParticles, playNoise }}
            onSettingsChange={(newSettings) => {
              if (newSettings.isDarkMode !== undefined) setIsDarkMode(newSettings.isDarkMode);
              if (newSettings.showParticles !== undefined) setShowParticles(newSettings.showParticles);
              if (newSettings.playNoise !== undefined) setPlayNoise(newSettings.playNoise);
            }}
          />
        )}
      </div>
      
      {/* AI Tutor is always available */}
      <AITutor />
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .glass-panel-dark {
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default App;