import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  Ticket, 
  Filter, 
  Layers, 
  Building2, 
  AlertTriangle, 
  Trash2, 
  Zap, 
  Droplets, 
  Maximize2,
  X,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES, STATUS_OPTIONS } from '../data/mockReports';

export default function ReportFeed({ 
  reports, 
  onUpvote, 
  onTrackTicket, 
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode
}) {
  const [previewImage, setPreviewImage] = useState(null);

  // Simple category badge helper (Monochrome / Subtle Emerald Accent)
  const getCategoryBadge = (categoryName) => {
    switch (categoryName) {
      case 'Jalan Rusak':
        return { icon: AlertTriangle, label: 'Jalan Rusak' };
      case 'Sampah/Limbah':
        return { icon: Trash2, label: 'Sampah/Limbah' };
      case 'Lampu Jalan':
        return { icon: Zap, label: 'Lampu Jalan' };
      case 'Banjir/Drainase':
        return { icon: Droplets, label: 'Banjir/Drainase' };
      default:
        return { icon: Building2, label: 'Fasilitas Umum' };
    }
  };

  // Simple status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return { 
          label: 'Selesai', 
          icon: CheckCircle2, 
          class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
        };
      case 'Sedang Ditangani':
        return { 
          label: 'Sedang Ditangani', 
          icon: Clock, 
          class: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30' 
        };
      default:
        return { 
          label: 'Menunggu Verifikasi', 
          icon: AlertCircle, 
          class: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' 
        };
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Filter Bar & View Toggle */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
        
        {/* Category Filters Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'semua'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({reports.length})
          </button>

          {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status Dropdown & Dual View Toggle Switch */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          {/* Toggle Dual View Switch */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'feed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Peta Grid</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reports Feed Grid */}
      {reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak Ada Laporan Ditemukan</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter kategori & status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => {
            const catBadge = getCategoryBadge(report.category);
            const CatIcon = catBadge.icon;
            const statusBadge = getStatusBadge(report.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div 
                key={report.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
              >
                {/* Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-md flex items-center gap-1">
                      <CatIcon className="w-3 h-3 text-emerald-400" />
                      {report.category}
                    </span>
                  </div>

                  {/* Zoom Image Button */}
                  <button
                    onClick={() => setPreviewImage(report.image)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    title="Pratinjau Foto"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Ticket ID */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 font-mono text-[10px] font-bold">
                      #{report.id}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 backdrop-blur-md ${statusBadge.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Info Tags */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span>{report.isAnonymous ? 'Pelapor Anonim' : report.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onUpvote(report.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        report.upvotedByUser
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByUser ? 'fill-white' : ''}`} />
                      <span>{report.upvotes} Dukungan</span>
                    </button>

                    <button
                      onClick={() => onTrackTicket(report.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Pratinjau Foto Bukti</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
