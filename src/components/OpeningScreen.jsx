import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';

export default function OpeningScreen({ onFinish }) {
  const [stage, setStage] = useState('loading'); // 'loading' | 'revealing' | 'done'
  const [progress, setProgress] = useState(0);

  // SVG Circular Progress Ring Math
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
          setStage('revealing');
        }, 200);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stage === 'revealing') {
      const timer = setTimeout(() => {
        setStage('done');
        if (onFinish) onFinish();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onFinish]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="opening-screen"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-50 pointer-events-none select-none font-sans overflow-hidden"
        >
          {/* 
            Wavy Curtain Overlay SVG Background 
            Mimics the Figma Ellipse/Union/Subtract wavy curtain reveal
          */}
          <motion.div
            initial={{ y: 0 }}
            animate={stage === 'revealing' ? { y: '-100%' } : { y: 0 }}
            transition={{
              duration: 1.0,
              ease: [0.76, 0, 0.24, 1], // Custom smooth 60 FPS cubic-bezier
            }}
            className="absolute inset-0 bg-[#050505] text-white flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Ambient Emerald Glow Radial Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

            {/* Opening Screen Content */}
            <motion.div
              animate={stage === 'revealing' ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 text-center space-y-6 px-6 max-w-md flex flex-col items-center"
            >
              
              {/* CIRCULAR PROGRESS RING (PROGRESS BUNDAR) + OFFICIAL LOGO */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                
                {/* Background Track Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-neutral-900"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  {/* Dynamic Glowing Emerald Progress Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-150 ease-out drop-shadow-[0_0_12px_#10B981]"
                  />
                </svg>

                {/* Official CivicPulse Building2 Emblem in Center of Ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/40 border border-emerald-400">
                    <Building2 className="w-7 h-7" />
                  </div>
                </div>

              </div>

              {/* Brand Title & Percentage Display */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-white uppercase">
                  CIVIC<span className="text-emerald-400">PULSE</span>
                </h1>

                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400 pt-1">
                  <span>LOADING</span>
                  <span className="text-sm font-black text-white px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                    {String(progress).padStart(2, '0')}%
                  </span>
                </div>
              </div>

              {/* Monospaced Subtitle */}
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-400/80 uppercase animate-pulse">
                  INITIALIZING CIVIC PULSE // SDG 11...
                </p>
              </div>

            </motion.div>

            {/* Bottom Wavy Edge SVG */}
            <div className="absolute left-0 right-0 top-full w-full h-32 overflow-hidden leading-none pointer-events-none">
              <svg
                className="relative block w-full h-full text-[#050505]"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                fill="currentColor"
              >
                <path d="M0,32L48,53.3C96,75,192,117,288,128C384,139,480,117,576,106.7C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
              </svg>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
