import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Dynamic progress counter from 0% to 100% over ~1.8s
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
      className="fixed inset-0 z-50 bg-[#111111] text-white flex flex-col items-center justify-center font-sans overflow-hidden select-none"
    >
      {/* Subtle Background Glow Radial Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center space-y-10">
        
        {/* Motion Stage with Vertical Dashed Centerline */}
        <div className="relative w-full h-36 flex items-center justify-center">
          
          {/* Vertical Dashed Centerline */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-r-2 border-dashed border-neutral-700/60" />

          {/* The Orbiting / Sliding Ball (Framer Motion Pendulum Animation) */}
          <motion.div
            animate={{
              x: [-60, 60, -60],
              scale: [0.95, 1.08, 0.95],
              boxShadow: [
                '0 10px 30px rgba(0,0,0,0.5)',
                '0 20px 40px rgba(255,255,255,0.08)',
                '0 10px 30px rgba(0,0,0,0.5)'
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 rounded-full bg-[#272727] border border-neutral-700/60 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden backdrop-blur-md"
          >
            {/* Inner Subtle Radial Highlight */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-600/30 to-white/10 blur-sm" />
          </motion.div>

        </div>

        {/* Minimalist Typography & Percentage Counter */}
        <div className="space-y-3">
          
          {/* Brand Title */}
          <motion.h1
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl font-black tracking-[0.3em] text-neutral-200 uppercase"
          >
            CIVIC<span className="text-neutral-400">PULSE</span>
          </motion.h1>

          {/* Percentage Counter Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center space-y-1"
          >
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400">
              {String(progress).padStart(2, '0')}%
            </span>

            {/* Subtle Progress Bar */}
            <div className="w-32 h-0.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-neutral-400 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase pt-2">
              SDG 11 // SMART CITY REPORT
            </span>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}
