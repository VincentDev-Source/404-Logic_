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
  const [hoverRating, setHoverRating] = useState(0);

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-black rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-md">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 dark:text-white">Lacak Tiket Aduan</h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                Sistem Pemantauan Progres Real-Time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Masukkan Nomor Tiket (#LP-2026-1001)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-mono font-medium"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow"
            >
              Cari Tiket
            </button>
          </form>

          {/* Quick Ticket Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-neutral-400 font-bold shrink-0">Contoh:</span>
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchInput(r.id);
                  setSelectedReport(r);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono font-bold shrink-0 transition-all ${
                  selectedReport?.id === r.id
                    ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                #{r.id}
              </button>
            ))}
          </div>

          {/* Ticket Details */}
          {selectedReport ? (
            <div className="space-y-4">
              
              {/* Ticket Card Info */}
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-bold border border-emerald-500/20">
                        #{selectedReport.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold">
                        {selectedReport.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white leading-snug">
                      {selectedReport.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 font-bold block">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold inline-block mt-0.5 ${
                      selectedReport.status === 'Selesai'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : selectedReport.status === 'Diproses' || selectedReport.status === 'Sedang Ditangani'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed font-medium">
                  {selectedReport.description}
                </p>

                {/* Rating Component for Completed Report inside Modal */}
                {selectedReport.status === 'Selesai' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-emerald-500 uppercase tracking-wider">
                        RATING & ULASAN KEPUASAN WARGA:
                      </span>
                      {selectedReport.rating ? (
                        <span className="font-black text-amber-400">{selectedReport.rating}/5 ★</span>
                      ) : (
                        <span className="text-neutral-400 italic">Pilih bintang untuk memberi ulasan</span>
                      )}
                    </div>

                    {selectedReport.rating ? (
                      <div className="flex items-center gap-1 pt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= selectedReport.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-400 fill-none'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-neutral-400 font-bold">Beri Rating Penanganan:</span>
                        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onClick={() => onRateReport && onRateReport(selectedReport.id, star, 'Ulasan Warga')}
                              className="transition-transform hover:scale-125 focus:outline-none p-0.5"
                              title={`Beri ${star} Bintang`}
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  star <= hoverRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-neutral-400 fill-none'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
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
                      {idx !== selectedReport.timeline.length - 1 && (
                        <div className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                          step.done ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-800'
                        }`} />
                      )}

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
              {selectedReport.image && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900 dark:text-white">
                    <Camera className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Dokumentasi Foto Lapangan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 block">Sebelum Perbaikan</span>
                      <div className="h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <img src={selectedReport.image || selectedReport.beforeImage} alt="Sebelum" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 block">Hasil Perbaikan</span>
                      <div className="h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-center p-2">
                        {selectedReport.status === 'Selesai' && selectedReport.afterImage ? (
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

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 shrink-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
