import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';

export default function TicketTrackerModal({ 
  isOpen, 
  onClose, 
  reports, 
  activeTicketId 
}) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (activeTicketId) {
      setSearchInput(activeTicketId);
      const matched = reports.find(r => r.id.toLowerCase() === activeTicketId.toLowerCase());
      setSelectedReport(matched || null);
    } else if (reports.length > 0) {
      setSelectedReport(reports[0]);
      setSearchInput(reports[0].id);
    }
  }, [activeTicketId, reports]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const matched = reports.find(r => 
      r.id.toLowerCase() === searchInput.trim().toLowerCase() ||
      r.id.toLowerCase().includes(searchInput.trim().toLowerCase())
    );

    if (matched) {
      setSelectedReport(matched);
    } else {
      setSelectedReport(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Tracking Status Tiket Aduan</h2>
              <p className="text-xs text-slate-400">Pantau perkembangan tindak lanjut dinas terkait secara real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Ticket Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Masukkan Nomor Tiket (misal: LP-2026-1001 atau 1002)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Cari Tiket
            </button>
          </form>

          {/* Quick Ticket Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs justify-center">
            <span className="text-slate-400 shrink-0 font-medium">Contoh Tiket:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchInput(r.id);
                  setSelectedReport(r);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono font-bold transition-all ${
                  selectedReport?.id === r.id
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                #{r.id}
              </button>
            ))}
          </div>

          {/* Main Ticket Status Details */}
          {!selectedReport ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Tiket Tidak Ditemukan</h3>
              <p className="text-xs text-slate-400">
                Nomor tiket "{searchInput}" tidak ditemukan di database. Pastikan format nomor tiket sesuai.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Ticket Card Info */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                        #{selectedReport.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
                        {selectedReport.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-2">
                      {selectedReport.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">Estimasi Penanganan:</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block mt-0.5">
                      {selectedReport.estimatedFixTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedReport.description}
                </p>

                {/* Responsible Agency Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instansi: <strong className="text-slate-200">{selectedReport.agency}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Lokasi: <strong className="text-slate-200">{selectedReport.location}</strong></span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Tahapan Progres Penanganan (4 Steps Timeline)</span>
                </h4>

                <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
                  {selectedReport.timeline.map((step, idx) => {
                    const isDone = step.done;
                    return (
                      <div key={idx} className="relative group">
                        
                        {/* Step Marker Dot */}
                        <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone 
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20' 
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-sm font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>
                              Tahap {step.step}: {step.title}
                            </h5>
                            <span className="text-[11px] font-mono text-slate-400">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photo Comparison Section (Sebelum vs Sesudah) */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-teal-400" />
                    <span>Perbandingan Foto Sebelum vs Sesudah Perbaikan</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Verifikasi Visual</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sebelum */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-rose-400">Kondisi Awal (Sebelum)</span>
                      <span className="text-slate-400 font-mono text-[10px]">{selectedReport.date}</span>
                    </div>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-950 border border-rose-500/30">
                      <img 
                        src={selectedReport.beforeImage || selectedReport.image} 
                        alt="Kondisi Sebelum" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  {/* Sesudah */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-400">Hasil Perbaikan (Sesudah)</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {selectedReport.afterImage ? 'Selesai' : 'Dalam Proses Pengerjaan'}
                      </span>
                    </div>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/30 flex items-center justify-center">
                      {selectedReport.afterImage ? (
                        <img 
                          src={selectedReport.afterImage} 
                          alt="Kondisi Sesudah" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="text-center p-4 space-y-2">
                          <Clock className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
                          <p className="text-xs font-semibold text-slate-300">Petugas sedang mengerjakan di lapangan</p>
                          <p className="text-[11px] text-slate-500">Foto perbaikan akan diperbarui otomatis setelah selesai.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
