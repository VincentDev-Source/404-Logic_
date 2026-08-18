import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Dynamic smooth progress counter from 0% to 100% over ~1.8s
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden select-none"
    >
      {/* Ambient Radial Laser Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0045DF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#4DBFFF]/20 rounded-full blur-[90px] pointer-events-none animate-pulse" />

      {/* Center Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-8">
        
        {/* Futuristic SVG Logo Icon from Figma */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#4DBFFF]/40 rounded-full blur-xl animate-pulse" />
          
          <svg
            className="w-20 h-20 sm:w-24 sm:h-24 relative z-10 text-[#6CE9ED] drop-shadow-[0_0_25px_#4DBFFF]"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG Logo Symbol Path from Figma Specs */}
            <path
              d="M430.667 269L416.521 297.292L388.229 283.146L402.375 254.854L430.667 269ZM269 430.667L297.292 416.521L283.146 388.229L254.854 402.375L269 430.667ZM69.3333 231L83.4792 202.708L111.771 216.854L97.625 245.146L69.3333 231ZM231 69.3333L202.708 83.4792L216.854 111.771L245.146 97.625L231 69.3333Z"
              fill="url(#laser_gradient)"
            />
            <circle cx="250" cy="250" r="160" stroke="#4DBFFF" strokeWidth="6" strokeDasharray="12 8" opacity="0.6" className="animate-spin-slow" />
            <circle cx="250" cy="250" r="100" stroke="#6CE9ED" strokeWidth="8" />
            <circle cx="250" cy="250" r="40" fill="#0045DF" className="animate-ping opacity-40" />

            <defs>
              <linearGradient id="laser_gradient" x1="69" y1="69" x2="430" y2="430" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6CE9ED" />
                <stop offset="0.5" stopColor="#4DBFFF" />
                <stop offset="1" stopColor="#0045DF" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Title & System Status */}
        <div className="space-y-1">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase"
          >
            CIVIC<span className="text-[#4DBFFF]">PULSE</span>
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#6CE9ED]/80 uppercase"
          >
            INITIALIZING CIVIC PULSE // SDG 11...
          </motion.p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-3">
          
          {/* Percentage Counter Display */}
          <div className="flex items-center justify-between text-xs font-mono font-extrabold px-1">
            <span className="text-neutral-500 tracking-wider">SYSTEM_LOADING</span>
            <span className="text-[#6CE9ED] text-sm tracking-widest drop-shadow-[0_0_10px_#4DBFFF]">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>

          {/* Neon Cyan Laser Line Progress Bar */}
          <div className="relative w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0045DF] via-[#4DBFFF] to-[#6CE9ED] rounded-full shadow-[0_0_15px_#4DBFFF]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

        </div>

        {/* Bottom Encryption / Protocol Status */}
        <div className="pt-4 flex items-center justify-center space-x-2 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6CE9ED] animate-ping" />
          <span>VERCEL DB CONNECTED // SECURE BIOMETRIC PROTOCOL</span>
        </div>

      </div>
    </motion.div>
  );
}
