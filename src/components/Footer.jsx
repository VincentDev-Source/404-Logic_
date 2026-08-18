import React from 'react';
import { Building2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenCreateModal }) {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black pt-10 pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-neutral-900 dark:text-white">
                Civic<span className="text-emerald-500">Pulse</span> / LaporKota
              </h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-medium">
              Platform Partisipasi Publik & Pemantauan Fasilitas Kota Cerdas untuk mendukung pencapaian Sustainable Development Goal (SDG) 11: Kota dan Komunitas Berkelanjutan.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Inisiatif Kota Transparan & Inklusif</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Navigasi Utama</h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <li>
                <button onClick={() => setActiveTab('feed')} className="hover:text-emerald-500 transition-colors">
                  Beranda & Feed Aduan
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-500 transition-colors">
                  Peta Laporan Interaktif
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-500 transition-colors">
                  Statistik & Dashboard Kota
                </button>
              </li>
              <li>
                <button onClick={onOpenCreateModal} className="hover:text-emerald-500 transition-colors">
                  Buat Laporan Baru
                </button>
              </li>
            </ul>
          </div>

          {/* SDG 11 Pillars */}
          <div>
            <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Pilar SDG 11</h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Infrastruktur Jalan Aman
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Penerangan PJU Kota
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Banjir & Drainase
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Aksesibilitas Difabel
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2 font-medium">
          <p>© 2026 CivicPulse / LaporKota. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Siap Melayani dengan sepenuh</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>untuk masyarakat</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
