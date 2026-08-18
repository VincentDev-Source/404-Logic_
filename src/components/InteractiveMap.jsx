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
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-colors">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-emerald-500">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-neutral-900 dark:text-white">Simulasi Peta Laporan Fasilitas</h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Klik marker pin di peta untuk melihat detail pengaduan</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
              filterCategory === 'semua'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Semua Pin ({reports.length})
          </button>
          {CATEGORIES.filter(c => c.id !== 'semua').map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                filterCategory === c.id
                  ? 'bg-emerald-500 text-black border-emerald-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Map Grid Surface */}
      <div className="relative w-full h-[480px] rounded-xl bg-neutral-100 dark:bg-black overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
        
        {/* Vector Grid Background */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(163, 163, 163, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(163, 163, 163, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
            transform: `scale(${zoomLevel})`
          }}
        >
          {/* Simulated River / Main Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <path d="M 0 140 Q 300 200 600 120 T 1200 280" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            <path d="M 200 0 Q 350 250 500 520" fill="none" stroke="#737373" strokeWidth="2" strokeDasharray="6 6" />
          </svg>

          {/* Interactive Report Pins */}
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;

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
                <div className={`p-2 rounded-full shadow-lg transition-transform duration-200 ${
                  isSelected
                    ? 'bg-emerald-500 text-black scale-125 ring-4 ring-emerald-500/30'
                    : 'bg-black text-white dark:bg-white dark:text-black border border-neutral-800 dark:border-neutral-200 hover:scale-110'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Hover Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-[10px] py-1 px-2.5 rounded font-bold whitespace-nowrap z-30 pointer-events-none border border-neutral-800 shadow-md">
                  {report.title} (#{report.id})
                </div>
              </div>
            );
          })}

        </div>

        {/* Selected Report Drawer Card */}
        {selectedReport && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xl z-30 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono text-[10px] font-extrabold">
                  #{selectedReport.id}
                </span>
                <h4 className="text-xs font-black text-neutral-900 dark:text-white mt-1 line-clamp-1">
                  {selectedReport.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {selectedReport.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => onUpvote(selectedReport.id)}
                className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:text-emerald-500 font-bold text-xs flex items-center gap-1"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedReport.upvotes}</span>
              </button>

              <button
                onClick={() => onTrackTicket(selectedReport.id)}
                className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-xs flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Detail Tiket</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
