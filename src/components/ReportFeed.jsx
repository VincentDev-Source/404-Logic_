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
  onDeleteReport,
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode
}) {
  const [previewImage, setPreviewImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Category badge helper
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

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return { 
          label: 'Selesai', 
          icon: CheckCircle2, 
          class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
        };
      case 'Sedang Ditangani':
        return { 
          label: 'Sedang Ditangani', 
          icon: Clock, 
          class: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700' 
        };
      default:
        return { 
          label: 'Menunggu Verifikasi', 
          icon: AlertCircle, 
          class: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700' 
        };
    }
  };

  const confirmDelete = (reportId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus aduan #${reportId} secara permanen?`)) {
      setDeletingId(reportId);
      onDeleteReport(reportId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Filter Bar & View Toggle */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
        
        {/* Category Filters Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mr-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === 'semua'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            Semua ({reports.length})
          </button>

          {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
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
            className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-semibold"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          {/* Dual View Toggle */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition-all flex items-center gap-1 ${
                viewMode === 'feed'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition-all flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Peta Leaflet</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reports Feed Grid */}
      {reports.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center text-neutral-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Tidak Ada Laporan Ditemukan</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
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
                className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 group"
              >
                {/* Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/80 text-white backdrop-blur-md flex items-center gap-1 border border-neutral-800">
                      <CatIcon className="w-3 h-3 text-emerald-400" />
                      {report.category}
                    </span>
                  </div>

                  {/* Top Right Action Overlay (Zoom + Delete) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewImage(report.image)}
                      className="p-1.5 rounded-md bg-black/80 hover:bg-black text-white backdrop-blur-md border border-neutral-800"
                      title="Pratinjau Foto"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Report Button */}
                    <button
                      onClick={() => confirmDelete(report.id)}
                      disabled={deletingId === report.id}
                      className="p-1.5 rounded-md bg-red-600/90 hover:bg-red-600 text-white backdrop-blur-md border border-red-500/50 transition-colors"
                      title="Hapus Aduan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ticket ID */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/90 text-emerald-400 font-mono text-[10px] font-extrabold border border-neutral-800">
                      #{report.id}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 backdrop-blur-md ${statusBadge.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Info Tags */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-neutral-400" />
                        <span>{report.isAnonymous ? 'Pelapor Anonim' : report.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => onUpvote(report.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        report.upvotedByUser
                          ? 'bg-emerald-500 text-black shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByUser ? 'fill-black' : ''}`} />
                      <span>{report.upvotes} Dukungan</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onTrackTicket(report.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1 transition-all"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Lacak</span>
                      </button>

                      <button
                        onClick={() => confirmDelete(report.id)}
                        className="p-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-red-500 hover:bg-red-500 hover:text-white border border-neutral-200 dark:border-neutral-800 transition-all sm:hidden"
                        title="Hapus Aduan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Pratinjau Foto Bukti</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
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
