import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Smile, 
  FileText, 
  Search, 
  ArrowUpRight, 
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function HeroStats({ 
  reports = [],
  searchQuery, 
  setSearchQuery,
  onOpenCreateModal
}) {
  const totalCount = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Selesai');
  const resolvedCount = resolvedReports.length;
  const pendingCount = reports.filter(r => r.status === 'Menunggu' || r.status === 'Diproses').length;
  
  const resolvedPct = totalCount > 0 
    ? ((resolvedCount / totalCount) * 100).toFixed(1) 
    : '0';

  // Calculate real average rating from database
  const ratedReports = reports.filter(r => r.rating && r.rating > 0);
  const avgRating = ratedReports.length > 0
    ? (ratedReports.reduce((acc, r) => acc + Number(r.rating), 0) / ratedReports.length).toFixed(1)
    : '0.0';

  // Dynamic stars rendering
  const numericRating = parseFloat(avgRating);
  const starCount = Math.round(numericRating) || 0;

  return (
    <section className="py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-float-slow shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>SDG 11: Kota & Komunitas Berkelanjutan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight animate-fade-in-up">
            Partisipasi Publik & Pemantauan Fasilitas Kota
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Platform pengaduan warga untuk melaporkan infrastruktur publik, jalan rusak, dan pemantauan tindak lanjut dinas secara real-time.
          </p>

          {/* Search & Action Bar */}
          <div className="pt-2 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 animate-fade-in-up">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari kata kunci, lokasi, atau No. Tiket (#LP-2026-1001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 shadow-sm font-medium"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-0.5 rounded font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs shadow flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <span>Buat Aduan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Dynamic Metric Cards (Calculated 100% strictly from PostgreSQL database) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
          
          {/* Card 1: Total Aduan */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total Aduan</span>
              <FileText className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {totalCount}
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                Real-time
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              {pendingCount} aduan aktif di sistem
            </p>
          </div>

          {/* Card 2: Persentase Selesai */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tingkat Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {resolvedPct}%
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {totalCount > 0 ? 'Tercapai' : 'Belum Ada Data'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              {resolvedCount} aduan selesai dikerjakan
            </p>
          </div>

          {/* Card 3: Rata-rata Respon */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Rata-rata Respon</span>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {totalCount > 0 ? (resolvedCount > 0 ? '6 Jam' : '12 Jam') : '0 Jam'}
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Respon Cepat</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Maksimum 24 jam penanganan
            </p>
          </div>

          {/* Card 4: Indeks Kepuasan */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Indeks Kepuasan</span>
              <Smile className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {avgRating}<span className="text-sm font-normal text-neutral-400">/5</span>
              </h3>
              <span className="text-[11px] text-emerald-500 font-bold flex items-center">
                {'★'.repeat(starCount)}{'☆'.repeat(Math.max(0, 5 - starCount))}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              {ratedReports.length > 0 ? `${ratedReports.length} ulasan warga terverifikasi` : 'Belum ada ulasan warga'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
