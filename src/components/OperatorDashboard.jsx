import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  RefreshCw, 
  UserCheck, 
  MapPin, 
  Search, 
  Loader2,
  FileCheck,
  Check
} from 'lucide-react';

export default function OperatorDashboard({ operator, onLogout }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Fetch all reports for operator management
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/operator/reports');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Gagal mengambil data laporan`);
      }
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('OperatorDashboard fetch error:', err);
      setError(err.message || 'Gagal memuat aduan warga');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Update report status (Diproses / Selesai)
  const handleUpdateStatus = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      const res = await fetch('/api/operator/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reportId,
          status: newStatus,
          verifiedBy: operator.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui status aduan');
      }

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus, verifiedBy: operator.name } : r))
      );

      setActionSuccessMsg(`Aduan #${reportId} berhasil diubah menjadi "${newStatus}" oleh ${operator.name}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.message || 'Gagal memperbarui status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'semua' && r.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      const matchLoc = (r.location || '').toLowerCase().includes(q);
      const matchId = String(r.id).toLowerCase().includes(q);
      return matchTitle || matchLoc || matchId;
    }
    return true;
  });

  const countPending = reports.filter(r => r.status === 'Menunggu').length;
  const countProcessing = reports.filter(r => r.status === 'Diproses' || r.status === 'Sedang Ditangani').length;
  const countCompleted = reports.filter(r => r.status === 'Selesai').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      
      {/* Top Operator Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Operator Brand Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-blue-600/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                  Portal Manajemen Petugas Kota
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                    SDG 11
                  </span>
                </h1>
                <p className="text-[11px] text-neutral-400 font-medium">Verifikasi & Penanganan Aduan Fasilitas Publik</p>
              </div>
            </div>

            {/* Officer Profile & Logout Button */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-neutral-800 border border-neutral-700 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Petugas: <span className="text-emerald-400 font-extrabold">{operator.name}</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 uppercase font-mono">{operator.role}</span>
              </div>

              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
                title="Keluar / Kunci Portal Petugas"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout Petugas</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Success Action Notification */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in-up shadow-lg">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Total Aduan Masuk</span>
            <p className="text-2xl font-black text-white">{reports.length}</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
            </span>
            <p className="text-2xl font-black text-amber-400">{countPending}</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Sedang Diproses
            </span>
            <p className="text-2xl font-black text-blue-400">{countProcessing}</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Dikerjakan
            </span>
            <p className="text-2xl font-black text-emerald-400">{countCompleted}</p>
          </div>
        </div>

        {/* Control Bar: Filters & Search */}
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus('semua')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                filterStatus === 'semua'
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}
            >
              Semua ({reports.length})
            </button>

            <button
              onClick={() => setFilterStatus('Menunggu')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                filterStatus === 'Menunggu'
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold'
                  : 'bg-neutral-800 text-amber-400 border-neutral-700'
              }`}
            >
              Menunggu ({countPending})
            </button>

            <button
              onClick={() => setFilterStatus('Diproses')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                filterStatus === 'Diproses'
                  ? 'bg-blue-600 text-white border-blue-600 font-extrabold'
                  : 'bg-neutral-800 text-blue-400 border-neutral-700'
              }`}
            >
              Diproses ({countProcessing})
            </button>

            <button
              onClick={() => setFilterStatus('Selesai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                filterStatus === 'Selesai'
                  ? 'bg-emerald-500 text-black border-emerald-500 font-extrabold'
                  : 'bg-neutral-800 text-emerald-400 border-neutral-700'
              }`}
            >
              Selesai ({countCompleted})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari judul / lokasi aduan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={fetchReports}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Reports Table / Card View */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-neutral-400">Mengambil daftar aduan warga dari PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs font-bold text-red-400">{error}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-16 text-center bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm font-bold text-white">Tidak Ada Aduan</p>
            <p className="text-xs text-neutral-500">Tidak ada aduan yang cocok dengan filter yang dipilih.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => {
              const isPending = report.status === 'Menunggu';
              const isProcessing = report.status === 'Diproses' || report.status === 'Sedang Ditangani';
              const isCompleted = report.status === 'Selesai';
              const isUpdatingThis = updatingId === report.id;

              return (
                <div
                  key={report.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-2">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-mono text-[10px] font-extrabold border border-blue-500/30">
                        #LP-2026-{String(report.id).padStart(4, '0')}
                      </span>

                      {isPending ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                          Menunggu Verifikasi
                        </span>
                      ) : isProcessing ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[10px] border border-blue-500/30">
                          Sedang Diproses
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                          Selesai Dikerjakan
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-white line-clamp-2 leading-snug">
                      {report.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-medium">
                      {report.description}
                    </p>

                    <div className="text-[11px] text-neutral-500 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{report.location || 'Lokasi tidak terdaftar'}</span>
                    </div>

                    {report.verifiedBy && (
                      <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                        <UserCheck className="w-3 h-3" />
                        <span>Diverifikasi oleh: {report.verifiedBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Operator Action Buttons */}
                  <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'Diproses')}
                      disabled={isProcessing || isCompleted || isUpdatingThis}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                        isProcessing
                          ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 cursor-default'
                          : isCompleted
                          ? 'bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {isUpdatingThis ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FileCheck className="w-3.5 h-3.5" />
                      )}
                      <span>Proses Aduan</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(report.id, 'Selesai')}
                      disabled={isCompleted || isUpdatingThis}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-md'
                      }`}
                    >
                      {isUpdatingThis ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Tandai Selesai</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}
