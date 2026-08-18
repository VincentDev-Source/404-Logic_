import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import ReportFeed from './components/ReportFeed';
import InteractiveMap from './components/InteractiveMap';
import CreateReportModal from './components/CreateReportModal';
import TicketTrackerModal from './components/TicketTrackerModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SplashScreen from './components/SplashScreen';
import ConfirmModal from './components/ConfirmModal';
import AlertModal from './components/AlertModal';
import Footer from './components/Footer';
import { CheckCircle2, X, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

// Normalize database records to match frontend component requirements
function normalizeReport(raw) {
  const id = raw.id;
  const numId = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10) || 1;
  const idStr = typeof id === 'number' ? `LP-2026-${String(id).padStart(4, '0')}` : String(id);

  // Extract GPS coordinates from location string if present (format: "... (GPS: lat, lng)")
  let lat = raw.coordinates?.lat || raw.lat;
  let lng = raw.coordinates?.lng || raw.lng;

  if ((!lat || !lng) && raw.location && raw.location.includes('GPS:')) {
    const gpsMatch = raw.location.match(/GPS:\s*([-\d.]+),\s*([-\d.]+)/);
    if (gpsMatch) {
      lat = parseFloat(gpsMatch[1]);
      lng = parseFloat(gpsMatch[2]);
    }
  }

  // Default fallback if GPS is not present
  if (!lat || !lng) {
    const defaultLat = -6.2088 + (((numId * 37) % 50) - 25) * 0.005;
    const defaultLng = 106.8456 + (((numId * 53) % 50) - 25) * 0.005;
    lat = defaultLat;
    lng = defaultLng;
  }

  const createdAtDate = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const formattedDate = raw.date || `${createdAtDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${createdAtDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

  return {
    id: idStr,
    rawId: numId,
    title: raw.title || 'Laporan Tanpa Judul',
    category: raw.category || 'Lainnya',
    categoryKey: (raw.category || '').toLowerCase().replace('/', '_').replace(/\s+/g, '_'),
    severity: raw.severity || 'Sedang',
    status: raw.status || 'Menunggu',
    statusKey: raw.status === 'Selesai' ? 'selesai' : raw.status === 'Sedang Ditangani' ? 'diproses' : 'menunggu',
    location: raw.location || 'Lokasi tidak disebutkan',
    city: raw.city || 'Jakarta',
    district: raw.district || 'Kecamatan Terkait',
    coordinates: { lat, lng },
    description: raw.description || '',
    author: raw.author || 'Warga Peduli',
    isAnonymous: raw.isAnonymous ?? false,
    date: formattedDate,
    upvotes: raw.upvotes ?? 0,
    upvotedByUser: Boolean(raw.upvotedByUser),
    agency: raw.agency || 'Dinas Terkait',
    estimatedFixTime: raw.estimatedFixTime || 'Dalam Penanganan',
    image: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    beforeImage: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    afterImage: raw.afterImage || null,
    timeline: raw.timeline || [
      { step: 1, title: 'Laporan Diterima', date: formattedDate, done: true, desc: 'Laporan terdaftar secara resmi di sistem CivicPulse.' },
      { step: 2, title: 'Verifikasi Dinas', date: 'Dalam Antrean', done: raw.status !== 'Menunggu', desc: 'Pengungahan berkas ke instansi dinas teknis terkait.' },
      { step: 3, title: 'Petugas Meluncur', date: 'Menunggu', done: raw.status === 'Sedang Ditangani' || raw.status === 'Selesai', desc: 'Penugasan tim inspeksi dan perbaikan lapangan.' },
      { step: 4, title: 'Perbaikan Selesai', date: 'Menunggu', done: raw.status === 'Selesai', desc: 'Proses pengerjaan dan konfirmasi perbaikan dari warga.' }
    ]
  };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'map' | 'analytics'
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTicketInput, setQuickTicketInput] = useState('');
  const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'map'

  // Custom Confirm & Alert Modal States (Replaces native browser "says" popups)
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger',
  });

  const [alertModalState, setAlertModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
  });

  const openConfirm = useCallback(({ title, message, onConfirm, type = 'danger' }) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    });
  }, []);

  const openAlert = useCallback(({ title = 'Pemberitahuan', message, type = 'warning' }) => {
    setAlertModalState({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  // Theme mode: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('civicpulse_theme');
    return saved ? saved : 'dark';
  });

  // Apply dark class to html document element
  useEffect(() => {
    localStorage.setItem('civicpulse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast helper
  const showToast = (title, message, type = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch reports from backend API (/api/reports)
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reports');
      if (!res.ok) {
        throw new Error(`Gagal memuat data (HTTP ${res.status})`);
      }
      const data = await res.json();
      const normalizedData = Array.isArray(data) ? data.map(normalizeReport) : [];
      setReports(normalizedData);
    } catch (err) {
      console.error('Error fetching reports from /api/reports:', err);
      setError('Gagal memuat data laporan dari database PostgreSQL. Silakan periksa koneksi internet atau server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter reports based on search, category, and status
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (selectedCategory !== 'semua' && report.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'semua' && report.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = report.title.toLowerCase().includes(query);
        const matchesDesc = report.description.toLowerCase().includes(query);
        const matchesId = String(report.id).toLowerCase().includes(query);
        const matchesLoc = (report.location || '').toLowerCase().includes(query);
        const matchesCity = (report.city || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesId || matchesLoc || matchesCity;
      }

      return true;
    });
  }, [reports, selectedCategory, selectedStatus, searchQuery]);

  // Metric Stats calculation
  const totalReportsCount = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'Selesai').length;
  const resolvedPercentage = totalReportsCount > 0 
    ? ((resolvedCount / totalReportsCount) * 100).toFixed(1) 
    : '94.2';

  // Handle report deletion
  const handleDeleteReport = async (reportId) => {
    const target = reports.find((r) => r.id === reportId || String(r.rawId) === String(reportId));
    if (!target) return;

    const targetDbId = target.rawId || target.id;

    try {
      const res = await fetch(`/api/reports?id=${targetDbId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menghapus aduan dari database');
      }

      setReports((prev) => prev.filter((r) => r.id !== reportId && String(r.rawId) !== String(targetDbId)));
      showToast('Aduan Dihapus', `Laporan #${target.id} telah berhasil dihapus secara permanen.`, 'success');
    } catch (err) {
      console.error('Error deleting report:', err);
      showToast('Gagal Menghapus', err.message || 'Terjadi kesalahan sistem.', 'error');
    }
  };

  // Handle upvoting with API patch call
  const handleUpvote = async (reportId) => {
    const target = reports.find((r) => r.id === reportId || String(r.rawId) === String(reportId));
    if (!target) return;

    const isUpvoted = target.upvotedByUser;
    const targetDbId = target.rawId || target.id;

    // Optimistic UI update
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId || String(report.rawId) === String(reportId)) {
          const newUpvotes = isUpvoted ? Math.max(0, report.upvotes - 1) : report.upvotes + 1;
          return {
            ...report,
            upvotes: newUpvotes,
            upvotedByUser: !isUpvoted,
          };
        }
        return report;
      })
    );

    showToast(
      isUpvoted ? 'Dukungan Dibatalkan' : 'Dukungan Berhasil Ditambahkan',
      `Laporan #${target.id} kini memiliki ${isUpvoted ? target.upvotes - 1 : target.upvotes + 1} dukungan warga.`
    );

    try {
      await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetDbId,
          action: isUpvoted ? 'downvote' : 'upvote',
        }),
      });
    } catch (err) {
      console.error('Failed to sync upvote with server:', err);
    }
  };

  // Handle open ticket tracker
  const handleTrackTicket = (ticketId) => {
    setActiveTicketId(ticketId);
    setIsTrackerModalOpen(true);
  };

  // Handle ticket search from navbar/quick inputs
  const handleSearchTicketFromNav = (ticketId) => {
    setActiveTicketId(ticketId);
    setIsTrackerModalOpen(true);
  };

  // Handle new report creation sending POST to /api/reports
  const handleCreateReport = async (newReportData) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReportData.title,
          category: newReportData.category,
          description: newReportData.description,
          location: newReportData.location,
          imageUrl: newReportData.imageUrl || newReportData.image,
          status: 'Menunggu',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal menyimpan laporan ke database server');
      }

      const createdReportFromDb = await res.json();
      const normalized = normalizeReport({
        ...createdReportFromDb,
        author: newReportData.author,
        isAnonymous: newReportData.isAnonymous,
        city: newReportData.city,
        coordinates: newReportData.coordinates,
      });

      setReports((prev) => [normalized, ...prev]);
      showToast(
        'Laporan Berhasil Diterbitkan 🎉',
        `Nomor Tiket Anda: #${normalized.id}. Laporan telah tersimpan ke database PostgreSQL.`
      );
    } catch (err) {
      console.error('Error creating report via API:', err);
      showToast('Gagal Membuat Laporan', err.message || 'Terjadi kesalahan sistem.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      
      {/* Initial Entrance Splash Screen with Real Progress Bar */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Modern Custom Confirmation Modal (Replaces window.confirm "says" popup) */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        message={confirmModalState.message}
        type={confirmModalState.type}
      />

      {/* Modern Custom Alert Modal (Replaces window.alert "says" popup) */}
      <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={() => setAlertModalState(prev => ({ ...prev, isOpen: false }))}
        title={alertModalState.title}
        message={alertModalState.message}
        type={alertModalState.type}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-xl flex items-start gap-2.5 animate-in slide-in-from-top-3 duration-200 text-xs">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            toastMessage.type === 'error' 
              ? 'bg-red-500/10 text-red-500' 
              : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div className="flex-1 pr-2">
            <h4 className="font-bold text-neutral-900 dark:text-white">{toastMessage.title}</h4>
            <p className="text-neutral-600 dark:text-neutral-300 mt-0.5 leading-normal">{toastMessage.message}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        quickTicketInput={quickTicketInput}
        setQuickTicketInput={setQuickTicketInput}
        onSearchTicket={handleSearchTicketFromNav}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero & Highlight Impact Metrics */}
        <HeroStats
          reportsCount={totalReportsCount}
          resolvedPercentage={resolvedPercentage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-neutral-600 dark:text-neutral-400 font-bold text-xs">
                Mengambil data aduan dari database PostgreSQL...
              </p>
            </div>
          ) : error ? (
            /* Error State Fallback UI */
            <div className="p-6 my-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <p className="text-red-600 dark:text-red-400 font-bold text-xs">{error}</p>
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Ulang Data</span>
              </button>
            </div>
          ) : (
            /* Main View Router Router */
            activeTab === 'analytics' ? (
              <AnalyticsDashboard reports={reports} theme={theme} />
            ) : viewMode === 'map' || activeTab === 'map' ? (
              <InteractiveMap
                reports={filteredReports}
                onUpvote={handleUpvote}
                onTrackTicket={handleTrackTicket}
                onDeleteReport={handleDeleteReport}
                openConfirm={openConfirm}
                openAlert={openAlert}
                theme={theme}
              />
            ) : (
              <ReportFeed
                reports={filteredReports}
                onUpvote={handleUpvote}
                onTrackTicket={handleTrackTicket}
                onDeleteReport={handleDeleteReport}
                openConfirm={openConfirm}
                openAlert={openAlert}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Modals */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitReport={handleCreateReport}
        openAlert={openAlert}
      />

      <TicketTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        reports={reports}
        activeTicketId={activeTicketId}
      />

    </div>
  );
}
