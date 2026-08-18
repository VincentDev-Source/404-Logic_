import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  RefreshCw, 
  MapPin, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink,
  X,
  Radio,
  Eye
} from 'lucide-react';

export default function EarthquakeAlert() {
  const [eqData, setEqData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarthquakeData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch('/api/earthquake');
      if (!res.ok) {
        throw new Error(`Gagal memuat data BMKG (HTTP ${res.status})`);
      }
      const result = await res.json();
      if (result.success && result.data) {
        setEqData(result.data);
        setError(null);
      } else {
        throw new Error('Format data BMKG tidak sesuai');
      }
    } catch (err) {
      console.error('Error fetching earthquake data:', err);
      setError(err.message || 'Gagal terhubung ke sensor BMKG');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and 60-second auto refresh interval
  useEffect(() => {
    fetchEarthquakeData();

    const interval = setInterval(() => {
      fetchEarthquakeData(true);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchEarthquakeData]);

  // Determine Badge Severity Style based on Magnitude and Tsunami Warning
  const getSeverityStyle = (mag, potensi = '') => {
    const isTsunami = potensi.toLowerCase().includes('berpotensi tsunami') && !potensi.toLowerCase().includes('tidak');
    
    if (mag >= 6.0 || isTsunami) {
      return {
        badgeBg: 'bg-rose-950/60 border-rose-800 text-rose-400',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        pulseColor: 'bg-rose-500',
        iconColor: 'text-rose-500',
        title: 'PERINGATAN GEMPA SIGINIFIKAN',
        isHighAlert: true,
      };
    } else if (mag >= 5.0) {
      return {
        badgeBg: 'bg-amber-950/60 border-amber-800 text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
        pulseColor: 'bg-amber-500',
        iconColor: 'text-amber-500',
        title: 'INFORMASI GEMPA BUMI REAL-TIME',
        isHighAlert: false,
      };
    } else {
      return {
        badgeBg: 'bg-emerald-950/60 border-emerald-800 text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        pulseColor: 'bg-emerald-500',
        iconColor: 'text-emerald-400',
        title: 'MONITORING SENSOR BENCANA BMKG',
        isHighAlert: false,
      };
    }
  };

  const severity = eqData ? getSeverityStyle(eqData.magnitudeNum, eqData.potensi) : null;

  return (
    <div className="w-full mb-6">
      
      {/* Skeleton Loading State */}
      {isLoading ? (
        <div className="w-full bg-[#09090b] border border-neutral-800 rounded-2xl p-4 sm:p-5 animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-neutral-800 rounded-lg" />
            <div className="h-4 w-24 bg-neutral-800 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-3/4 bg-neutral-800 rounded-lg" />
              <div className="h-4 w-1/2 bg-neutral-800 rounded-lg" />
            </div>
          </div>
        </div>
      ) : error && !eqData ? (
        /* Error Fallback Card */
        <div className="w-full bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchEarthquakeData(true)}
            className="px-3 py-1 bg-rose-900/40 hover:bg-rose-900/60 rounded-lg text-rose-200 font-bold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      ) : eqData ? (
        /* Main Early Warning Alert Card */
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative w-full bg-[#09090b] border border-neutral-800 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 ${severity.glow}`}
        >
          {/* Top Live Status Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${severity.pulseColor}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${severity.pulseColor}`} />
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                LIVE SENSOR BMKG TEWS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                SDG TARGET 11.5
              </span>
            </div>

            {/* Refresh Button */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-500 hidden md:inline-block">
                Auto-Sync 60s
              </span>
              <button
                onClick={() => fetchEarthquakeData(true)}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all active:scale-95 disabled:opacity-50"
                title="Refresh Data BMKG"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Left: Magnitude Circle Badge + Main Info */}
            <div className="flex items-start gap-3.5 flex-1 w-full min-w-0">
              
              {/* Large Magnitude Circle Badge */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border ${severity.badgeBg} flex flex-col items-center justify-center shrink-0 shadow-inner mt-0.5`}>
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-80">MAG</span>
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                  M {eqData.magnitude}
                </span>
              </div>

              {/* Title & Region Details (Clean Multi-line Text Wrapping - NO TRUNCATE / CUT OFF) */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight leading-snug break-words">
                  {eqData.wilayah}
                </h4>

                <div className="flex items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400 font-medium flex-wrap">
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span>{eqData.tanggal}, {eqData.jam}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Layers className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span>Kedalaman {eqData.kedalaman}</span>
                  </span>
                </div>

                {/* Tsunami & MMI Feeling Status Badges (Clean Wrapping) */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[10px]">
                  <span className={`px-2 py-1 rounded-lg font-bold border leading-normal break-words ${
                    eqData.potensi.toLowerCase().includes('tidak')
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                      : 'bg-rose-950/60 text-rose-400 border-rose-800'
                  }`}>
                    {eqData.potensi}
                  </span>
                  {eqData.dirasakan && eqData.dirasakan !== 'Tidak dirasakan' && (
                    <span className="px-2 py-1 rounded-lg font-bold bg-neutral-900 text-neutral-300 border border-neutral-800 leading-normal break-words">
                      Dirasakan: {eqData.dirasakan}
                    </span>
                  )}
                </div>

              </div>

            </div>

            {/* Right: Action Button to Open Shakemap Preview Modal */}
            {eqData.shakemapUrl && (
              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-neutral-800/60 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md group"
                >
                  <Eye className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Peta Shakemap</span>
                </button>
              </div>
            )}

          </div>

          {/* Shakemap Image Modal Preview */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-[#09090b] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="text-sm font-black text-white">Peta Guncangan Gempa (Shakemap BMKG)</h3>
                        <p className="text-[10px] text-neutral-400 font-mono">{eqData.wilayah}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Shakemap Image Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black flex items-center justify-center min-h-[250px]">
                    <img
                      src={eqData.shakemapUrl}
                      alt="BMKG Shakemap"
                      className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  {/* Modal Footer Info */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <span className="font-mono text-[10px]">Pusat Data BMKG TEWS Indonesia</span>
                    <a
                      href="https://www.bmkg.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                    >
                      <span>Web Resmi BMKG</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      ) : null}

    </div>
  );
}
