import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpeningScreen({ onFinish }) {
  const [stage, setStage] = useState('loading'); // 'loading' | 'revealing' | 'done'

  useEffect(() => {
    // Stage 1: Hold initial logo & progress for 1.8s
    const timer1 = setTimeout(() => {
      setStage('revealing');
    }, 1800);

    // Stage 2: Finish curtain reveal after 2.8s total
    const timer2 = setTimeout(() => {
      setStage('done');
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

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
            {/* Ambient Emerald Glow Radial Orb (100% Matching CivicPulse Emerald Theme) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

            {/* Opening Screen Content */}
            <motion.div
              animate={stage === 'revealing' ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 text-center space-y-4 px-6 max-w-md"
            >
              {/* Brand Logo Header */}
              <div className="space-y-1">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 p-0.5 mx-auto mb-3 shadow-[0_0_30px_#10B981]"
                >
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                    <span className="text-xl font-black text-emerald-400">CP</span>
                  </div>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-white uppercase">
                  CIVIC<span className="text-emerald-400">PULSE</span>
                </h1>
              </div>

              {/* Monospaced Subtitle */}
              <div className="pt-2">
                <p className="text-[11px] font-mono font-bold tracking-widest text-emerald-400/90 uppercase animate-pulse">
                  INITIALIZING CIVIC PULSE // SDG 11...
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-40 h-0.5 bg-neutral-900 rounded-full mx-auto overflow-hidden border border-neutral-800">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 shadow-[0_0_10px_#10B981]"
                />
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
