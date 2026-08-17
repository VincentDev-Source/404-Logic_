import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  Ticket, 
  ExternalLink, 
  Eye, 
  Filter, 
  Layers, 
  Building2, 
  AlertTriangle, 
  Trash2, 
  Zap, 
  Droplets, 
  ShieldCheck,
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

  // Helper function to return category styling & icon
  const getCategoryStyle = (categoryName) => {
    switch (categoryName) {
      case 'Jalan Rusak':
        return { icon: AlertTriangle, bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'Sampah/Limbah':
        return { icon: Trash2, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'Lampu Jalan':
        return { icon: Zap, bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'Banjir/Drainase':
        return { icon: Droplets, bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      default:
        return { icon: Building2, bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
    }
  };

  // Helper function to return status styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return { label: 'Selesai', icon: CheckCircle2, class: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40' };
      case 'Sedang Ditangani':
        return { label: 'Sedang Ditangani', icon: Clock, class: 'bg-sky-500/15 text-sky-300 border-sky-400/40 animate-pulse' };
      default:
        return { label: 'Menunggu Verifikasi', icon: AlertCircle, class: 'bg-amber-500/15 text-amber-300 border-amber-400/40' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filter Bar & View Toggle */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filters Pill */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'semua'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Semua ({reports.length})
          </button>

          {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
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
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          {/* Toggle Dual View Switch */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'feed'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu (Feed)</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">Tidak ada laporan yang cocok</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori & status laporan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const catStyle = getCategoryStyle(report.category);
            const CatIcon = catStyle.icon;
            const statusStyle = getStatusBadge(report.status);
            const StatusIcon = statusStyle.icon;

            return (
              <div 
                key={report.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-800/80"
              >
                {/* Image Container with Hover Zoom Preview */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-md ${catStyle.bg}`}>
                      <CatIcon className="w-3.5 h-3.5" />
                      {report.category}
                    </span>
                  </div>

                  {/* Zoom Image Trigger */}
                  <button
                    onClick={() => setPreviewImage(report.image)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    title="Pratinjau Foto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Ticket ID Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-emerald-400 font-mono text-[11px] font-bold border border-slate-800">
                      #{report.id}
                    </span>
                  </div>

                  {/* Realtime Status Badge */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 backdrop-blur-md ${statusStyle.class}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Metadata Info */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                        <span>{report.isAnonymous ? 'Pelapor Anonim' : report.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions: Upvote & Track Ticket */}
                  <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-800/80">
                    
                    {/* Upvote Button */}
                    <button
                      onClick={() => onUpvote(report.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        report.upvotedByUser
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${report.upvotedByUser ? 'fill-slate-950' : ''}`} />
                      <span>{report.upvotes} Dukungan</span>
                    </button>

                    {/* Track Ticket Button */}
                    <button
                      onClick={() => onTrackTicket(report.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-800 flex items-center gap-1.5 transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Lacak Status</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Zoom Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Pratinjau Bukti Foto Facility Issue</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[80vh] flex items-center justify-center bg-slate-950">
              <img src={previewImage} alt="Preview" className="max-h-[75vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
