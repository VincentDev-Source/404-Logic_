import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Loader2 } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Menyiapkan antarmuka CivicPulse...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress bar simulation corresponding to loading stages
    const timer1 = setTimeout(() => {
      setProgress(25);
      setStatusText('Menghubungkan ke database PostgreSQL...');
    }, 300);

    const timer2 = setTimeout(() => {
      setProgress(60);
      setStatusText('Memuat data aduan fasilitas kota...');
    }, 700);

    const timer3 = setTimeout(() => {
      setProgress(85);
      setStatusText('Menginisialisasi Leaflet OpenStreetMap...');
    }, 1100);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStatusText('Siap!');
    }, 1400);

    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1600);

    const timer6 = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500 ${
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Background Ambient Glow */}
      <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Logo & Entrance Card */}
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm text-center px-4">
        
        {/* Animated Brand Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-2xl animate-bounce">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-emerald-500/40 blur-md -z-10 animate-pulse" />
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1">
            Civic<span className="text-emerald-500">Pulse</span>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-800 font-bold ml-1">
              LaporKota
            </span>
          </h1>
          <p className="text-xs text-neutral-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            SDG 11: Kota & Komunitas Berkelanjutan
          </p>
        </div>

        {/* Real Progress Bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full bg-neutral-900 border border-neutral-800 h-2 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400">
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
              {statusText}
            </span>
            <span className="font-mono text-emerald-400">{progress}%</span>
          </div>
        </div>

      </div>

    </div>
  );
}
