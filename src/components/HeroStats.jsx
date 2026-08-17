import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Smile, 
  FileText, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Building,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function HeroStats({ 
  reportsCount, 
  resolvedPercentage, 
  searchQuery, 
  setSearchQuery,
  onOpenCreateModal
}) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>SDG 11 Initiative: Sustainable Cities & Communities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Suara Warga untuk Kota <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Cerdas, Aman & Berkelanjutan
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Laporkan kerusakan jalan, lampu mati, banjir, dan sampah liar secara real-time. Pantau proses penanganan secara transparan demi fasilitas publik yang lebih baik.
          </p>

          {/* Search & Action Bar */}
          <div className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari lokasi, kata kunci (misal: 'Jalan Rusak'), atau No. Tiket (#LP-2026-1001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-xl transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-xs bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-md"
                >
                  Reset
                </button>
              )}
            </div>

            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
            >
              <span>Buat Aduan</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Impact Highlight Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          
          {/* Card 1: Total Aduan */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Aduan</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">1,420+</h3>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +12%
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1">
              Termasuk {reportsCount} laporan aktif di sistem
            </p>
          </div>

          {/* Card 2: Persentase Selesai */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tingkat Selesai</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {resolvedPercentage}%
              </h3>
              <span className="text-xs text-teal-400 font-semibold">SDG Target</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1">
              Tindakan tepat sasaran oleh dinas
            </p>
          </div>

          {/* Card 3: Rata-rata Respon */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rata-rata Respon</span>
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">12 Jam</h3>
              <span className="text-xs text-sky-400 font-semibold">Tindakan Cepat</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1">
              Standar respon maksimum 24 jam
            </p>
          </div>

          {/* Card 4: Indeks Kepuasan */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Indeks Kepuasan</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Smile className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">4.8<span className="text-lg text-slate-400">/5</span></h3>
              <span className="text-xs text-amber-400 font-semibold">★★★★★</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1">
              Berdasarkan ulasan transparansi warga
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
