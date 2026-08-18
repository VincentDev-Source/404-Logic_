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

  // Category badge helper
  const getCategoryBadge = (catName) => {
    const matched = CATEGORIES.find(c => c.name === catName);
    return matched || { icon: Flame, name: catName };
  };

  const handleConfirmDelete = (reportId) => {
    if (openConfirm) {
      openConfirm({
        title: 'Hapus Aduan Fasilitas',
        message: `Apakah Anda yakin ingin menghapus aduan #${reportId} secara permanen? Data yang dihapus tidak dapat dikembalikan.`,
        confirmText: 'Ya, Hapus Aduan',
        cancelText: 'Batal',
        type: 'danger',
        onConfirm: () => onDeleteReport(reportId),
      });
    } else {
      onDeleteReport(reportId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name || (cat.id === 'semua' && selectedCategory === 'semua');
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === 'semua' ? 'semua' : cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Status Filters & View Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-bold"
          >
            <option value="semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>

          <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                viewMode === 'feed'
                  ? 'bg-white dark:bg-black text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Kartu
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-black text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Peta
            </button>
          </div>

        </div>

      </div>

      {/* Reports Feed Grid with Staggered Entrance Animations */}
      {reports.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 sm:p-12 text-center space-y-3 animate-fade-in-up">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center text-neutral-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Tidak Ada Laporan Ditemukan</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter kategori & status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reports.map((report, idx) => {
            const catBadge = getCategoryBadge(report.category);
            const CatIcon = catBadge.icon;
            const statusBadge = getStatusBadge(report.status);
            const StatusIcon = statusBadge.icon;
            // After-Fix photo MUST strictly ONLY render when status is 'Selesai' AND afterImage exists!
            const hasAfterImage = report.status === 'Selesai' && Boolean(report.afterImage);

            return (
              <div 
                key={report.id}
                style={{ animationDelay: `${(idx % 6) * 0.08}s` }}
                className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
              >
                {/* Image Container (Before vs After - Only shown on Completed reports) */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  {hasAfterImage ? (
                    <div className="grid grid-cols-2 h-full w-full divide-x divide-neutral-800">
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={report.image}
                          alt="Sebelum"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-400 text-[8px] sm:text-[9px] font-bold">
                          Sebelum
                        </span>
                      </div>

                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={report.afterImage}
                          alt="Sesudah"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[8px] sm:text-[9px] font-extrabold">
                          Hasil Petugas
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={report.image}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-black/80 text-white backdrop-blur-md flex items-center gap-1 border border-neutral-800 shadow">
                      <CatIcon className="w-3 h-3 text-emerald-400" />
                      {report.category}
                    </span>
                  </div>

                  {/* Top Right Action Overlay (Zoom + Delete) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={() => setPreviewImage((hasAfterImage && report.afterImage) || report.image)}
                      className="p-1.5 rounded-md bg-black/80 hover:bg-black text-white backdrop-blur-md border border-neutral-800 active:scale-95 transition-all"
                      title="Pratinjau Foto"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleConfirmDelete(report.id)}
                      className="p-1.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white backdrop-blur-md border border-red-500/50 active:scale-95 transition-all"
                      title="Hapus Aduan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold border flex items-center gap-1 backdrop-blur-md shadow ${statusBadge.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">
                      {report.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {report.description}
                    </p>
                  </div>

                  {/* Rating Component for Completed Reports (Multi-Line Flex Wrap for Small Mobile Screens) */}
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
                                  : 'text-neutral-400'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold">Beri Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => onRateReport && onRateReport(report.id, star, 'Ulasan Warga')}
                              className="text-neutral-400 hover:text-amber-400 hover:scale-125 transition-transform p-0.5"
                              title={`Beri ${star} Bintang`}
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 hover:fill-amber-400" />
                            </button>
                          ))}
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
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <UserCheck className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{report.isAnonymous ? 'Pelapor Anonim' : report.author}</span>
                      </div>
                    </div>

                    {report.verifiedBy && (
                      <div className="text-[9px] sm:text-[10px] text-emerald-500 font-bold flex items-center gap-1 pt-0.5 truncate">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">Diverifikasi oleh: {report.verifiedBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 gap-1">
                    <button
                      onClick={() => onUpvote(report.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 ${
                        report.upvotedByUser
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 border border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotes} Dukungan</span>
                    </button>

                    <button
                      onClick={() => onTrackTicket(report.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Lacak</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white dark:bg-black rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Pratinjau Foto Bukti Aduan</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-2 max-h-[75vh] flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
