import React from 'react';

interface LuminaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  state?: 'idle' | 'thinking' | 'speaking';
}

const LuminaAvatar: React.FC<LuminaAvatarProps> = ({ size = 'md', className = '', state = 'idle' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* 1. The Accretion Disk (Outer Glow Ring) */}
      <div className={`absolute inset-[-20%] rounded-full bg-gradient-to-tr from-orange-500/40 via-transparent to-blue-500/40 blur-xl animate-spin-slow ${state === 'thinking' ? 'animate-pulse duration-700' : ''}`} style={{ animationDuration: '8s' }}></div>
      
      {/* 2. The Event Horizon (Golden/Orange Ring) */}
      <div className="absolute inset-0 rounded-full border-[1px] border-orange-200/30 shadow-[0_0_15px_rgba(255,165,0,0.6)] animate-pulse-slow"></div>
      
      {/* 3. The Singularity (Core) */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-black flex items-center justify-center z-10 group">
        
        {/* Accretion Disk Stream inside */}
        <div className="absolute w-[150%] h-[20%] top-[40%] bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-md opacity-80 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000"></div>
        <div className="absolute w-[150%] h-[10%] top-[45%] bg-white blur-sm opacity-90 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000"></div>
        
        {/* Gravitational Lensing (Glass effect) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50 backdrop-blur-[1px]"></div>
        
        {/* Core Glow */}
        <div className={`w-[20%] h-[20%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] ${state === 'speaking' ? 'animate-ping' : ''}`}></div>
      </div>

      {/* 4. Orbital Particles */}
      <div className="absolute inset-[-10%] animate-spin-reverse-slow pointer-events-none" style={{ animationDuration: '12s' }}>
         <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
      </div>
    </div>
  );
};

export default LuminaAvatar;