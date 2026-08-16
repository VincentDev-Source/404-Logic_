import React from 'react';
import { Building2, Star, CheckCircle, Wifi, Car, Coffee, Shield, Accessibility } from 'lucide-react';
import { TERMINAL_FACILITIES } from '../data/indonesiaTransportData';

export const TerminalInfo = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-emerald-500/20 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-emerald">Infrastruktur Transportasi Darat</span>
            <span className="badge badge-blue">Kemenhub ID</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Panduan Stasiun & Terminal Indonesia
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Informasi lengkap fasilitas umum, area parkir, lounge VIP, akses disabilitas, dan fasilitas konektivitas di hub transportasi utama.
          </p>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TERMINAL_FACILITIES.map((term, idx) => (
          <div key={idx} className="glass-card overflow-hidden border-slate-800 flex flex-col justify-between">
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={term.image}
                  alt={term.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-extrabold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{term.rating} / 5.0</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-extrabold text-white">{term.name}</h3>
                <p className="text-xs text-slate-300">{term.description}</p>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Fasilitas Utama:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {term.facilities.map((fac, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-center">
              <span className="text-xs text-emerald-400 font-semibold">
                ✓ Siap Melayani Penumpang 24/7
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
