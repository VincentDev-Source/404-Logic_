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
  Camera,
  Star
} from 'lucide-react';

export default function TicketTrackerModal({ 
  isOpen, 
  onClose, 
  reports, 
  activeTicketId,
  onRateReport
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-sm">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 dark:text-white">Lacak Status Tiket Aduan</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Pantau perkembangan penanganan dinas terkait secara real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
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
              className="w-full pl-9 pr-24 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-[11px] transition-all"
            >
              Cari Tiket
            </button>
          </form>

          {/* Quick Ticket Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] justify-center">
            <span className="text-neutral-400 shrink-0 font-medium">Contoh:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchInput(r.id);
                  setSelectedReport(r);
                }}
                className={`px-2.5 py-0.5 rounded font-mono font-bold transition-all active:scale-95 ${
                  selectedReport?.id === r.id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                #{r.id}
              </button>
            ))}
          </div>

          {/* Detailed Ticket Tracker Display */}
          {selectedReport ? (
            <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in-up">
              
              {/* Ticket Overview Card */}
              <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono font-extrabold text-[11px]">
                      #{selectedReport.id}
                    </span>
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white mt-1">
                      {selectedReport.title}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    {selectedReport.status}
                  </span>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed font-medium">
                  {selectedReport.description}
                </p>

                {/* Rating Component for Completed Report inside Modal */}
                {selectedReport.status === 'Selesai' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-emerald-500 uppercase tracking-wider">
                        Rating & Ulasan Kepuasan Warga:
                      </span>
                      {selectedReport.rating && (
                        <span className="font-black text-amber-400">{selectedReport.rating}/5 ★</span>
                      )}
                    </div>

                    {selectedReport.rating ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= selectedReport.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-400'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-neutral-400 font-bold">Beri Rating Penanganan:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => onRateReport && onRateReport(selectedReport.id, star, 'Ulasan Warga')}
                            className="text-neutral-400 hover:text-amber-400 hover:scale-125 transition-transform"
                            title={`Beri ${star} Bintang`}
                          >
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{selectedReport.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{selectedReport.agency}</span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3">
                <h4 className="font-black text-neutral-900 dark:text-white text-xs uppercase tracking-wider">
                  Timeline Proses Penanganan Dinas
                </h4>

                <div className="space-y-3 pl-2">
                  {selectedReport.timeline?.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 relative">
                      {/* Timeline Line */}
                      {idx !== selectedReport.timeline.length - 1 && (
                        <div className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                          step.done ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-800'
                        }`} />
                      )}

                      {/* Timeline Dot */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.done 
                          ? 'bg-emerald-500 text-black font-extrabold' 
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                      }`}>
                        {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{step.step}</span>}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <h5 className={`font-bold text-xs ${step.done ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                            {step.title}
                          </h5>
                          <span className="text-[10px] text-neutral-400 font-medium">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before & After Photo Comparison */}
              {selectedReport.beforeImage && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900 dark:text-white">
                    <Camera className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Dokumentasi Foto Lapangan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 block">Sebelum Perbaikan</span>
                      <div className="h-28 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <img src={selectedReport.beforeImage} alt="Sebelum" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 block">Hasil Perbaikan</span>
                      <div className="h-28 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-center p-2">
                        {selectedReport.afterImage ? (
                          <img src={selectedReport.afterImage} alt="Sesudah" className="w-full h-full object-cover" />
                        ) : (
                          <div className="space-y-1 text-neutral-400">
                            <Clock className="w-5 h-5 mx-auto" />
                            <p className="text-[10px] font-bold">Dalam Pengerjaan</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="font-bold text-neutral-900 dark:text-white text-xs">Tiket Tidak Ditemukan</p>
              <p className="text-neutral-500 text-[11px]">Pastikan format nomor tiket benar (contoh: #LP-2026-1001).</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
