import React, { useState } from 'react';
import { 
  Filter, 
  MapPin, 
  ThumbsUp, 
  Ticket, 
  Clock, 
  UserCheck, 
  Maximize2,
  Trash2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  Star,
  Camera,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

// Sub-component for interactive hover star rating input in Feed Cards
function FeedCardRatingInput({ reportId, onRateReport }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverRating(star)}
          onClick={() => onRateReport && onRateReport(reportId, star, 'Ulasan Warga')}
          className="transition-transform hover:scale-125 focus:outline-none p-0.5"
          title={`Beri ${star} Bintang`}
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${
              star <= hoverRating
                ? 'fill-amber-400 text-amber-400'
                : 'text-neutral-400 fill-none'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReportFeed({ 
  reports, 
  onUpvote, 
  onTrackTicket, 
  onDeleteReport,
  onRateReport,
  openConfirm,
  openAlert,
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode
}) {
  const [previewImage, setPreviewImage] = useState(null);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return { label: 'Selesai', class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: CheckCircle2 };
      case 'Sedang Ditangani':
      case 'Diproses':
        return { label: 'Diproses', class: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: Sparkles };
      default:
        return { label: 'Menunggu', class: 'bg-amber-500/10 text-amber-500 border-amber-500/30', icon: Clock };
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Category & Status Filter Bar */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-4 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center space-x-1 pr-2 border-r border-neutral-200 dark:border-neutral-800 shrink-0 font-bold text-neutral-500 dark:text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>

          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 active:scale-95 ${
              selectedCategory === 'semua'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            Semua
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 active:scale-95 flex items-center space-x-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-neutral-500 dark:text-neutral-400">Status Penanganan:</span>
            {['semua', 'Menunggu', 'Diproses', 'Selesai'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all active:scale-95 ${
                  selectedStatus === status
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {status === 'semua' ? 'Semua Status' : status}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono font-semibold">
            Menampilkan <span className="font-bold text-neutral-900 dark:text-white">{reports.length}</span> laporan warga
          </div>
        </div>

      </div>

      {/* Reports Feed Grid */}
      {reports.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Tidak ada laporan ditemukan</h3>
          <p className="text-neutral-500 text-xs max-w-sm mx-auto">
            Tidak ada laporan aduan yang cocok dengan filter atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reports.map((report) => {
            const statusInfo = getStatusBadge(report.status);
            const StatusIcon = statusInfo.icon;

            return (
              <article 
                key={report.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col group"
              >
                {/* Card Header Media */}
                <div className="relative h-44 w-full bg-neutral-950 overflow-hidden shrink-0">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px]">
                    
                    {/* Category Badge */}
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold border border-white/10">
                      {report.category}
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-lg border font-bold backdrop-blur-md flex items-center space-x-1 ${statusInfo.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Ticket Number & Upvotes floating at bottom of image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                    <span className="font-mono font-bold bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      #{report.id}
                    </span>
                    <button
                      onClick={() => setPreviewImage(report.image)}
                      className="p-1 rounded-md bg-black/60 hover:bg-black text-white/80 hover:text-white transition-colors"
                      title="Perbesar Foto Lapangan"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">
                      {report.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {report.description}
                    </p>
                  </div>

                  {/* Rating Component for Completed Reports */}
                  {report.status === 'Selesai' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 sm:p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1 text-[9px] sm:text-[10px]">
                        <span className="font-extrabold text-emerald-500 uppercase tracking-wider truncate">
                          Kepuasan Penanganan Warga:
                        </span>
                        {report.rating && (
                          <span className="font-black text-amber-400 shrink-0">{report.rating}/5 ★</span>
                        )}
                      </div>

                      {report.rating ? (
                        <div className="flex items-center gap-1 pt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= report.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-400 fill-none'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold">Beri Rating:</span>
                          <FeedCardRatingInput reportId={report.id} onRateReport={onRateReport} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info Tags */}
                  <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-[9px] sm:text-[10px] flex-wrap gap-1">
                      <span>Oleh: {report.isAnonymous ? 'Warga Rahasia' : report.author}</span>
                      <span>{report.date}</span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    
                    {/* Upvote Button */}
                    <button
                      onClick={() => onUpvote(report.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 border ${
                        report.upvotedByUser
                          ? 'bg-emerald-500 text-black border-emerald-500 shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByUser ? 'fill-black' : ''}`} />
                      <span>{report.upvotes}</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {/* Track Ticket Button */}
                      <button
                        onClick={() => onTrackTicket(report.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-extrabold text-[11px] flex items-center space-x-1 border border-neutral-200 dark:border-neutral-700 transition-colors"
                        title="Lacak Progres Pengerjaan Dinas"
                      >
                        <Ticket className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Lacak</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          openConfirm({
                            title: 'Hapus Aduan Ini?',
                            message: `Apakah Anda yakin ingin menghapus aduan #${report.id} secara permanen? Data yang dihapus tidak dapat dikembalikan.`,
                            type: 'danger',
                            onConfirm: () => onDeleteReport(report.id),
                          });
                        }}
                        className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Hapus Aduan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={previewImage} alt="Preview Foto Lapangan" className="w-full h-full object-contain max-h-[85vh]" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
