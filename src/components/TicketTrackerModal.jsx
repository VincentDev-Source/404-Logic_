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
  Camera 
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

    setSelectedReport(matched || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Lacak Status Tiket Aduan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pantau perkembangan penanganan dinas terkait secara real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Ticket Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Masukkan Nomor Tiket (misal: LP-2026-1001)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-20 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
            >
              Cari Tiket
            </button>
          </form>

          {/* Quick Ticket Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] justify-center">
            <span className="text-slate-400 shrink-0 font-medium">Contoh:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchInput(r.id);
                  setSelectedReport(r);
                }}
                className={`px-2 py-0.5 rounded border font-mono font-semibold transition-all ${
                  selectedReport?.id === r.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                #{r.id}
              </button>
            ))}
          </div>

          {/* Ticket Details */}
          {!selectedReport ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-lg text-center space-y-2 border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tiket Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nomor tiket "{searchInput}" tidak ada di database. Silakan periksa kembali.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Ticket Card Info */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                        #{selectedReport.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        {selectedReport.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {selectedReport.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block">Estimasi:</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedReport.estimatedFixTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedReport.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instansi: <strong className="text-slate-700 dark:text-slate-200">{selectedReport.agency}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Lokasi: <strong className="text-slate-700 dark:text-slate-200">{selectedReport.location}</strong></span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tahapan Progres Penanganan (4 Steps)</span>
                </h4>

                <div className="relative border-l-2 border-slate-300 dark:border-slate-800 ml-3 pl-5 space-y-6">
                  {selectedReport.timeline.map((step, idx) => {
                    const isDone = step.done;
                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[27px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.step}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-bold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                              Tahap {step.step}: {step.title}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-400">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photo Comparison Section */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Perbandingan Foto Sebelum vs Sesudah</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Verifikasi Visual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sebelum (Laporan Warga)</span>
                    <div className="h-36 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <img 
                        src={selectedReport.beforeImage || selectedReport.image} 
                        alt="Sebelum" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Sesudah (Hasil Perbaikan)</span>
                    <div className="h-36 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                      {selectedReport.afterImage ? (
                        <img 
                          src={selectedReport.afterImage} 
                          alt="Sesudah" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <Clock className="w-6 h-6 text-slate-400 animate-spin mx-auto" />
                          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Dalam Proses Pengerjaan</p>
                          <p className="text-[10px] text-slate-400">Foto akan diperbarui jika selesai.</p>
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
