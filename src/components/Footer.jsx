import React from 'react';
import { Building2, ShieldCheck, Heart, Github, Globe, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenCreateModal }) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Civic<span className="text-emerald-400">Pulse</span> / LaporKota
              </h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform Partisipasi Publik & Pemantauan Fasilitas Kota Cerdas untuk mendukung pencapaian Sustainable Development Goal (SDG) 11: Kota dan Komunitas Berkelanjutan.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inisiatif Kota Transparan & Inklusif 2026</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('feed')} className="hover:text-emerald-400 transition-colors">
                  Beranda & Feed Aduan
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 transition-colors">
                  Peta Laporan Interaktif
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-400 transition-colors">
                  Statistik & Dashboard Kota
                </button>
              </li>
              <li>
                <button onClick={onOpenCreateModal} className="hover:text-emerald-400 transition-colors">
                  Buat Laporan Baru
                </button>
              </li>
            </ul>
          </div>

          {/* SDG 11 Priorities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Pilar SDG 11</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Infrastruktur Jalan Safe
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Penerangan PJU Kota
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Banjir & Tanggap Siaga
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Aksesibilitas Difabel
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CivicPulse / LaporKota - Platform Partisipasi Publik Cerdas.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Kompetisi Inovasi SDG 11</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
