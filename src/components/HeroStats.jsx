import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Smile, 
  FileText, 
  Search, 
  ArrowUpRight, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function HeroStats({ 
  reportsCount, 
  resolvedPercentage, 
  searchQuery, 
  setSearchQuery,
  onOpenCreateModal
}) {
  return (
    <section className="py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SDG 11: Kota & Komunitas Berkelanjutan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Partisipasi Publik & Pemantauan Fasilitas Kota
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Platform pengaduan warga untuk melaporkan infrastruktur publik, jalan rusak, dan pemantauan tindak lanjut dinas secara real-time.
          </p>

          {/* Search & Action Bar */}
          <div className="pt-2 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari kata kunci, lokasi, atau No. Tiket (#LP-2026-1001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded"
                >
                  Reset
                </button>
              )}
            </div>

            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <span>Buat Aduan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
          
          {/* Card 1: Total Aduan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Aduan</span>
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">1,420+</h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {reportsCount} aduan aktif di sistem
            </p>
          </div>

          {/* Card 2: Persentase Selesai */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tingkat Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {resolvedPercentage}%
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Tercapai</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Penanganan oleh dinas terkait
            </p>
          </div>

          {/* Card 3: Rata-rata Respon */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-rata Respon</span>
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">12 Jam</h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Respon Cepat</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Maksimum 24 jam penanganan
            </p>
          </div>

          {/* Card 4: Indeks Kepuasan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Indeks Kepuasan</span>
              <Smile className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">4.8<span className="text-sm font-normal text-slate-400">/5</span></h3>
              <span className="text-[11px] text-amber-500 font-semibold">★★★★★</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Ulasan partisipasi warga
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
