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
  Check,
  X,
  Camera,
  Upload,
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
  FileText,
  Edit3
} from 'lucide-react';

const SAMPLE_AFTER_PHOTOS = [
  { label: 'Jalan Mulus (Perbaikan)', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Area Bersih (Sampah Clean)', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lampu Nyala (PJU Berfungsi)', url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Drainase Lancar', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pintu Air Perbaikan', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Taman Rapi (Hijau)', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80' },
];

// Complex Process & Inspection Modal Suite for City Officers
function ProcessReportModal({ report, operator, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(report?.status || 'Diproses');
  const [verifiedBy, setVerifiedBy] = useState(report?.verifiedBy || operator.name);
  const [officerNotes, setOfficerNotes] = useState(report?.officerNotes || '');
  const [afterImage, setAfterImage] = useState(report?.afterImage || SAMPLE_AFTER_PHOTOS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const formattedDate = report.createdAt 
    ? new Date(report.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
    : 'Tanggal tidak tercatat';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (targetStatus) => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(
        report.id, 
        targetStatus || status, 
        afterImage, 
        verifiedBy.trim() || operator.name,
        officerNotes.trim()
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      
      {/* Modal Dialog with Fixed Height Flex Column for 100% Scrollability */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200 text-white">
        
        {/* Sticky Modal Header (Never cut off, title always accessible!) */}
        <div className="sticky top-0 z-20 shrink-0 flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-xl bg-blue-600/20 text-blue-400 font-mono text-xs font-black border border-blue-500/30">
              #LP-2026-{String(report.id).padStart(4, '0')}
            </span>
            <div>
              <h2 className="text-base font-black text-white">Pemeriksaan & Tindak Lanjut Kompleks Petugas</h2>
              <p className="text-xs text-neutral-400 font-medium">Verifikasi Lapangan & Pengelolaan Foto Perbaikan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Status Selection Switcher Pills */}
          <div className="space-y-1.5 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
            <label className="block text-[11px] font-extrabold uppercase text-neutral-400 tracking-wider">
              Pilih Status Penanganan Aduan *
            </label>
            
            <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setStatus('Menunggu')}
                className={`py-2 rounded-lg font-extrabold text-xs transition-all ${
                  status === 'Menunggu'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-amber-400 hover:bg-neutral-800'
                }`}
              >
                Menunggu
              </button>

              <button
                type="button"
                onClick={() => setStatus('Diproses')}
                className={`py-2 rounded-lg font-extrabold text-xs transition-all ${
                  status === 'Diproses' || status === 'Sedang Ditangani'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-blue-400 hover:bg-neutral-800'
                }`}
              >
                Diproses
              </button>

              <button
                type="button"
                onClick={() => setStatus('Selesai')}
                className={`py-2 rounded-lg font-extrabold text-xs transition-all ${
                  status === 'Selesai'
                    ? 'bg-emerald-500 text-black shadow'
                    : 'text-emerald-400 hover:bg-neutral-800'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* Rincian Aduan Grid */}
          <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-neutral-500 tracking-wider">Judul Aduan Warga</span>
              <h3 className="text-base font-black text-white mt-0.5">{report.title}</h3>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-neutral-500 tracking-wider">Deskripsi Masalah</span>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium mt-0.5">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800 text-neutral-400">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 block">Waktu Masuk Aduan</span>
                  <span className="text-xs font-semibold text-neutral-200">{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 block">Lokasi & GPS Presisi</span>
                  <span className="text-xs font-semibold text-neutral-200 line-clamp-2">{report.location || 'Tidak tercatat'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Nama Petugas & Catatan Teknis Penanganan */}
          <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Nama Petugas Verifikator / Tim Lapangan *
              </label>
              <input
                type="text"
                required
                placeholder="Nama Petugas Penanggung Jawab..."
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Catatan Teknis Penanganan Petugas
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan tindakan perbaikan yang telah/sedang dilakukan (e.g. Tim Bina Marga telah melakukan penambalan aspal setebal 5cm)..."
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Dokumentasi Foto Sebelum vs Sesudah */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-400" />
              Dokumentasi Foto Lapangan (Sebelum & Sesudah)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Foto Sebelum */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 block flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Foto Bukti Aduan (Sebelum)
                </span>
                <div className="h-40 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                  <img src={report.imageUrl || report.image} alt="Sebelum" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Foto Sesudah (Upload Petugas) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto Hasil Perbaikan (Sesudah)
                </span>
                <div className="h-40 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 relative group">
                  {afterImage ? (
                    <img src={afterImage} alt="Sesudah" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 space-y-1 p-2 text-center">
                      <Upload className="w-6 h-6" />
                      <span className="text-[11px] font-bold">Unggah foto hasil pekerjaan</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Input Foto Petugas */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Pilih atau Unggah Foto Hasil Perbaikan Petugas *
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="URL Foto atau unggah berkas foto dari galeri HP/Laptop..."
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />

                <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Berkas</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Sample Quick Select Photos for Officers */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {SAMPLE_AFTER_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAfterImage(sample.url)}
                    className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                      afterImage === sample.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-bold text-white text-center py-0.5 truncate px-1">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Sticky Modal Actions Footer */}
        <div className="sticky bottom-0 z-20 shrink-0 p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(status)}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Simpan Perubahan & Foto ({status})</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function OperatorDashboard({ operator, onLogout }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Inspection Modal State
  const [selectedInspectReport, setSelectedInspectReport] = useState(null);

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

  // Update report status (Menunggu / Diproses / Selesai) with afterImage & officerNotes
  const handleUpdateStatus = async (reportId, newStatus, afterImg = null, verifier = null, notes = null) => {
    setUpdatingId(reportId);
    try {
      const res = await fetch('/api/operator/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reportId,
          status: newStatus,
          verifiedBy: verifier || operator.name,
          afterImage: afterImg,
          officerNotes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui status aduan');
      }

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { 
          ...r, 
          status: newStatus, 
          verifiedBy: verifier || operator.name,
          afterImage: afterImg || r.afterImage,
          officerNotes: notes || r.officerNotes,
        } : r))
      );

      setActionSuccessMsg(`Aduan #${reportId} berhasil diperbarui (Status: "${newStatus}") oleh ${verifier || operator.name}`);
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
      
      {/* Detail Inspection & Process Modal */}
      {selectedInspectReport && (
        <ProcessReportModal
          report={selectedInspectReport}
          operator={operator}
          onClose={() => setSelectedInspectReport(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

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
                  onClick={() => setSelectedInspectReport(report)}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-blue-500/60 transition-all cursor-pointer group"
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

                    <h3 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
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

                  {/* Operator Action Buttons (Always Clickable on ALL Cards!) */}
                  <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectReport(report);
                      }}
                      className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspeksi Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectReport(report);
                      }}
                      className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Foto Hasil</span>
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
