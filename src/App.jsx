import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import ReportFeed from './components/ReportFeed';
import InteractiveMap from './components/InteractiveMap';
import CreateReportModal from './components/CreateReportModal';
import TicketTrackerModal from './components/TicketTrackerModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import OpeningScreen from './components/OpeningScreen';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import ConfirmModal from './components/ConfirmModal';
import AlertModal from './components/AlertModal';
import FaceAuth from './components/FaceAuth';
import FaceAuthOperator from './components/FaceAuthOperator';
import OperatorDashboard from './components/OperatorDashboard';
import Footer from './components/Footer';
import CurvedNavbar from './components/CurvedNavbar';
import { CheckCircle2, X, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

// Normalize database records to match frontend component requirements
function normalizeReport(raw) {
  const id = raw.id;
  const numId = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10) || 1;
  const idStr = typeof id === 'number' ? `LP-2026-${String(id).padStart(4, '0')}` : String(id);

  let lat = null;
  let lng = null;

  // PRIORITY 1 (Ground Truth): Parse exact embedded (GPS: lat, lng) from raw.location
  if (raw.location && raw.location.includes('GPS:')) {
    const gpsMatch = raw.location.match(/GPS:\s*([-\d.]+),\s*([-\d.]+)/);
    if (gpsMatch) {
      lat = parseFloat(gpsMatch[1]);
      lng = parseFloat(gpsMatch[2]);
    }
  }

  // PRIORITY 2: Fallback to raw.coordinates if present
  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
    lat = raw.coordinates?.lat || raw.lat;
    lng = raw.coordinates?.lng || raw.lng;
  }

  // PRIORITY 3: Default fallback if coordinates remain null
  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
    const defaultLat = -6.2088 + (((numId * 37) % 50) - 25) * 0.005;
    const defaultLng = 106.8456 + (((numId * 53) % 50) - 25) * 0.005;
    lat = defaultLat;
    lng = defaultLng;
  }

  const createdAtDate = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const formattedDate = raw.date || `${createdAtDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${createdAtDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

  const isPending = !raw.status || raw.status === 'Menunggu';
  const isProcessing = raw.status === 'Diproses' || raw.status === 'Sedang Ditangani';
  const isCompleted = raw.status === 'Selesai';

  // Dynamic Timeline reflecting exact officer status updates
  const dynamicTimeline = [
    {
      step: 1,
      title: 'Laporan Diterima',
      date: formattedDate,
      done: true,
      desc: 'Laporan terdaftar secara resmi di sistem CivicPulse.'
    },
    {
      step: 2,
      title: 'Verifikasi Dinas',
      date: raw.verifiedBy ? `Oleh: ${raw.verifiedBy}` : (!isPending ? 'Terverifikasi' : 'Dalam Antrean'),
      done: !isPending,
      desc: raw.verifiedBy ? `Telah diverifikasi oleh ${raw.verifiedBy}.` : 'Pengungahan berkas ke instansi dinas teknis terkait.'
    },
    {
      step: 3,
      title: 'Petugas Meluncur',
      date: isCompleted ? 'Selesai Penanganan' : (isProcessing ? 'Sedang Diproses' : 'Menunggu Penugasan'),
      done: isProcessing || isCompleted,
      desc: isProcessing ? 'Tim teknis dinas sedang berada di lokasi untuk pengerjaan.' : 'Penugasan tim inspeksi dan perbaikan lapangan.'
    },
    {
      step: 4,
      title: 'Perbaikan Selesai',
      date: isCompleted ? 'Selesai & Diverifikasi' : 'Menunggu Perbaikan',
      done: isCompleted,
      desc: isCompleted ? 'Proses pengerjaan selesai dan foto perbaikan diunggah.' : 'Proses pengerjaan dan konfirmasi perbaikan dari warga.'
    }
  ];

  return {
    id: idStr,
    rawId: numId,
    title: raw.title || 'Laporan Tanpa Judul',
    category: raw.category || 'Lainnya',
    categoryKey: (raw.category || '').toLowerCase().replace('/', '_').replace(/\s+/g, '_'),
    severity: raw.severity || 'Sedang',
    status: raw.status || 'Menunggu',
    statusKey: isCompleted ? 'selesai' : isProcessing ? 'diproses' : 'menunggu',
    location: raw.location || 'Lokasi tidak disebutkan',
    city: raw.city || 'Jakarta',
    district: raw.district || 'Kecamatan Terkait',
    coordinates: { lat, lng },
    description: raw.description || '',
    author: raw.author || 'Warga Peduli',
    isAnonymous: raw.isAnonymous ?? false,
    verifiedBy: raw.verifiedBy || null,
    officerNotes: raw.officerNotes || null,
    rating: raw.rating || null,
    ratingFeedback: raw.ratingFeedback || null,
    date: formattedDate,
    upvotes: raw.upvotes ?? 0,
    upvotedByUser: Boolean(raw.upvotedByUser),
    agency: raw.agency || 'Dinas Terkait',
    estimatedFixTime: raw.estimatedFixTime || 'Dalam Penanganan',
    image: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    beforeImage: raw.imageUrl || raw.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    afterImage: raw.afterImage || null,
    timeline: dynamicTimeline
  };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('civicpulse_face_auth') === 'true';
  });

  // Operator Portal States
  const [isOperatorPortal, setIsOperatorPortal] = useState(false);
  const [activeOperator, setActiveOperator] = useState(null);

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

  // Face Recognition Auth Callbacks
  const handleFaceAuthSuccess = () => {
    sessionStorage.setItem('civicpulse_face_auth', 'true');
    setIsAuthenticated(true);
    showToast('Autentikasi Berhasil 🎉', 'Akses diterima! Selamat datang di Dashboard CivicPulse.', 'success');
  };

  const handleLockFaceAuth = () => {
    sessionStorage.removeItem('civicpulse_face_auth');
    setIsAuthenticated(false);
    showToast('Aplikasi Dikunci 🔒', 'Sesi autentikasi wajah Anda telah dikunci kembali.', 'info');
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
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated, fetchReports]);

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

  // Handle citizen rating & review submission for completed reports
  const handleRateReport = async (reportId, ratingValue, feedbackText) => {
    const target = reports.find(r => r.id === reportId || String(r.rawId) === String(reportId));
    if (!target) return;
    const targetDbId = target.rawId || target.id;

    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetDbId,
          action: 'rate',
          rating: ratingValue,
          ratingFeedback: feedbackText,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan rating aduan');
      }

      setReports(prev => prev.map(r => {
        if (r.id === reportId || String(r.rawId) === String(targetDbId)) {
          return { ...r, rating: ratingValue, ratingFeedback: feedbackText };
        }
        return r;
      }));

      showToast('Rating Terkirim ⭐', `Terima kasih! Anda memberikan ulasan ${ratingValue} Bintang untuk aduan #${target.id}.`, 'success');
    } catch (err) {
      console.error('Failed to submit rating:', err);
      showToast('Gagal Memberi Rating', err.message || 'Terjadi kesalahan sistem.', 'error');
    }
  };

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

  // Operator Portal Mode Switch Router
  if (isOperatorPortal) {
    if (!activeOperator) {
      return (
        <FaceAuthOperator
          onLoginSuccess={(op) => setActiveOperator(op)}
          onCancel={() => setIsOperatorPortal(false)}
        />
      );
    }
    return (
      <OperatorDashboard
        operator={activeOperator}
        onLogout={() => {
          setActiveOperator(null);
          setIsOperatorPortal(false);
          fetchReports();
        }}
      />
    );
  }

  // If user is not authenticated with Face Recognition, display FaceAuth protection screen
  if (!isAuthenticated) {
    return (
      <FaceAuth onSuccess={handleFaceAuthSuccess} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      
      {/* Animated Wavy Curtain Opening Screen */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <OpeningScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

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
        onLockFaceAuth={handleLockFaceAuth}
        onOpenOperatorPortal={() => setIsOperatorPortal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero Impact Metrics (Always rendered) */}
        <HeroStats
          reports={reports}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 sm:pb-16">
          
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
            /* Main View Router */
            activeTab === 'analytics' ? (
              <AnalyticsDashboard reports={reports} theme={theme} />
            ) : activeTab === 'map' ? (
              <InteractiveMap
                reports={filteredReports}
                onUpvote={handleUpvote}
                onTrackTicket={handleTrackTicket}
                onDeleteReport={handleDeleteReport}
                onRateReport={handleRateReport}
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
                onRateReport={handleRateReport}
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

      {/* Global Curved Floating Bottom Navbar (For Smartphone Viewports) */}
      <div className="sm:hidden">
        <CurvedNavbar
          activeTab={
            activeTab === 'feed'
              ? 'home'
              : activeTab === 'map'
              ? 'search'
              : activeTab === 'analytics'
              ? 'like'
              : 'home'
          }
          onTabChange={(tabId) => {
            if (tabId === 'home') setActiveTab('feed');
            else if (tabId === 'search') setActiveTab('map');
            else if (tabId === 'like') setActiveTab('analytics');
          }}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
          onOpenOperatorPortal={() => setIsOperatorPortal(true)}
          onLockFaceAuth={handleLockFaceAuth}
        />
      </div>

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
        onRateReport={handleRateReport}
      />

    </div>
  );
}
