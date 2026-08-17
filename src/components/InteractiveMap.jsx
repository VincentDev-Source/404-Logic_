import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  Ticket, 
  ThumbsUp, 
  Compass, 
  Building2 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

export default function InteractiveMap({ reports, onUpvote, onTrackTicket }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('semua');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredReports = filterCategory === 'semua'
    ? reports
    : reports.filter(r => r.category === filterCategory);

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Simulasi Peta Laporan Fasilitas</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Klik marker pin di peta untuk melihat detail pengaduan</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === 'semua'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Semua Pin ({reports.length})
          </button>
          {CATEGORIES.filter(c => c.id !== 'semua').map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                filterCategory === c.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Map Grid Surface */}
      <div className="relative w-full h-[480px] rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Vector Grid Background */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
            transform: `scale(${zoomLevel})`
          }}
        >
          {/* Simulated River Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
            <path d="M 0 140 Q 300 200 600 120 T 1200 280" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
            <path d="M 200 0 Q 350 250 500 520" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="6 6" />
          </svg>

          {/* Interactive Report Pins */}
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            const isResolved = report.status === 'Selesai';

            return (
              <div
                key={report.id}
                style={{
                  left: `${report.coordinates.mapX}%`,
                  top: `${report.coordinates.mapY}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                onClick={() => setSelectedReport(report)}
              >
                {/* Pin Circle */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isResolved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 text-white'
                } ${isSelected ? 'ring-4 ring-emerald-300 dark:ring-emerald-700 scale-125' : 'group-hover:scale-110'}`}>
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                </div>

                {/* Tooltip Hover */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700 whitespace-nowrap shadow-lg z-30">
                  {report.title} (#{report.id})
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-[11px] space-y-1 z-30 shadow-sm">
          <div className="font-bold text-slate-800 dark:text-slate-200">Legenda Peta:</div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Titik Aduan Aktif</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span>
            <span>Aduan Selesai</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-30">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow flex items-center justify-center"
          >
            +
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow flex items-center justify-center"
          >
            -
          </button>
        </div>

        {/* Selected Popup Card */}
        {selectedReport && (
          <div className="absolute top-3 right-3 max-w-xs w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xl z-40 space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  #{selectedReport.id}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                  {selectedReport.title}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
              {selectedReport.description}
            </p>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{selectedReport.location}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onUpvote(selectedReport.id)}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                  selectedReport.upvotedByUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{selectedReport.upvotes} Dukungan</span>
              </button>

              <button
                onClick={() => {
                  onTrackTicket(selectedReport.id);
                  setSelectedReport(null);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
              >
                <Ticket className="w-3 h-3" />
                <span>Detail</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
