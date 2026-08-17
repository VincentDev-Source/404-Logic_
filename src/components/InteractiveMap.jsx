import React, { useState } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Trash2, 
  Zap, 
  Droplets, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Ticket,
  ThumbsUp,
  Layers,
  Compass,
  Maximize2
} from 'lucide-react';
import { CATEGORIES } from '../data/mockReports';

export default function InteractiveMap({ reports, onUpvote, onTrackTicket }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterCategory, setFilterCategory] = useState('semua');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredReports = filterCategory === 'semua'
    ? reports
    : reports.filter(r => r.category === filterCategory);

  const getPinColor = (category, status) => {
    if (status === 'Selesai') return 'bg-emerald-500 text-slate-950 border-emerald-300 ring-emerald-500/30';
    switch (category) {
      case 'Jalan Rusak':
        return 'bg-rose-500 text-white border-rose-300 ring-rose-500/30';
      case 'Sampah/Limbah':
        return 'bg-emerald-500 text-white border-emerald-300 ring-emerald-500/30';
      case 'Lampu Jalan':
        return 'bg-amber-500 text-slate-950 border-amber-300 ring-amber-500/30';
      case 'Banjir/Drainase':
        return 'bg-sky-500 text-white border-sky-300 ring-sky-500/30';
      default:
        return 'bg-purple-500 text-white border-purple-300 ring-purple-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Simulasi Peta Interaktif Fasilitas Kota</h3>
            <p className="text-[11px] text-slate-400">Klik marker titik merah/kuning/biru untuk melihat detail laporan</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === 'semua' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Semua Pin ({reports.length})
          </button>
          {CATEGORIES.filter(c => c.id !== 'semua').map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                filterCategory === c.id ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Map Grid Surface */}
      <div className="relative w-full h-[520px] rounded-2xl glass-card overflow-hidden border border-slate-800/80 shadow-2xl">
        
        {/* Map Vector Grid Background Simulation */}
        <div 
          className="absolute inset-0 bg-slate-950 transition-transform duration-300"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 1) 100%),
              linear-gradient(to right, rgba(51, 65, 85, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(51, 65, 85, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            transform: `scale(${zoomLevel})`
          }}
        >
          {/* Simulated Rivers & Road Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <path d="M 0 150 Q 300 200 600 120 T 1200 300" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round" />
            <path d="M 200 0 Q 350 250 500 520" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />
            <path d="M 0 350 Q 400 320 1200 450" fill="none" stroke="#475569" strokeWidth="6" />
            <circle cx="420" cy="350" r="180" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          </svg>

          {/* Interactive Report Pins */}
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            const pinClass = getPinColor(report.category, report.status);

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
                {/* Pulse Ring */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg ring-4 transition-all duration-300 ${pinClass} ${
                  isSelected ? 'scale-125 ring-emerald-400' : 'group-hover:scale-110'
                }`}>
                  <MapPin className="w-4 h-4 fill-current stroke-[2]" />
                </div>

                {/* Tooltip Hover Label */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-xl z-30">
                  {report.title} (#{report.id})
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-[11px] space-y-1.5 z-30">
          <div className="font-bold text-slate-300 mb-1">Legenda Peta:</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="text-slate-400">Jalan Rusak / Bahaya</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span className="text-slate-400">Banjir & Drainase</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-400">Lampu Jalan Mati</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-400">Sampah / Laporan Selesai</span>
          </div>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-lg"
          >
            +
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-lg"
          >
            -
          </button>
        </div>

        {/* Selected Pin Popup Card */}
        {selectedReport && (
          <div className="absolute top-4 right-4 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl z-40 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  #{selectedReport.id}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedReport.title}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">
              {selectedReport.description}
            </p>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{selectedReport.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instansi: {selectedReport.agency}</span>
              </div>
            </div>

            {/* Popup Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
              <button
                onClick={() => onUpvote(selectedReport.id)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                  selectedReport.upvotedByUser
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedReport.upvotes} Dukungan</span>
              </button>

              <button
                onClick={() => {
                  onTrackTicket(selectedReport.id);
                  setSelectedReport(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Detail</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
