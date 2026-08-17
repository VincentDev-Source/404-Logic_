import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import ReportFeed from './components/ReportFeed';
import InteractiveMap from './components/InteractiveMap';
import CreateReportModal from './components/CreateReportModal';
import TicketTrackerModal from './components/TicketTrackerModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Footer from './components/Footer';
import { getStoredReports, saveStoredReports, generateTicketId } from './utils/storage';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState(() => getStoredReports());
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'map' | 'analytics'
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTicketInput, setQuickTicketInput] = useState('');
  const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'map'
  
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

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState('');

  // Custom Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state changes to LocalStorage
  useEffect(() => {
    saveStoredReports(reports);
  }, [reports]);

  // Show Toast notification helper
  const showToast = (title, message, type = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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
        const matchesId = report.id.toLowerCase().includes(query);
        const matchesLoc = report.location.toLowerCase().includes(query);
        const matchesCity = report.city.toLowerCase().includes(query);
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

  // Handle upvoting
  const handleUpvote = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          const isUpvoted = report.upvotedByUser;
          const newUpvotes = isUpvoted ? report.upvotes - 1 : report.upvotes + 1;
          showToast(
            isUpvoted ? 'Dukungan Dibatalkan' : 'Dukungan Berhasil Ditambahkan',
            `Laporan #${report.id} kini memiliki ${newUpvotes} dukungan warga.`
          );
          return {
            ...report,
            upvotes: newUpvotes,
            upvotedByUser: !isUpvoted,
          };
        }
        return report;
      })
    );
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

  // Handle new report creation
  const handleCreateReport = (newReportData) => {
    const newId = generateTicketId();
    const newReport = {
      id: newId,
      title: newReportData.title,
      category: newReportData.category,
      categoryKey: newReportData.category.toLowerCase().replace('/', '_').replace(' ', '_'),
      severity: 'Sedang',
      status: 'Menunggu Verifikasi',
      statusKey: 'menunggu',
      location: newReportData.location,
      city: newReportData.city,
      district: 'Kecamatan Terkait',
      coordinates: { 
        lat: -6.2088, 
        lng: 106.8456, 
        mapX: Math.floor(20 + Math.random() * 60), 
        mapY: Math.floor(20 + Math.random() * 60) 
      },
      description: newReportData.description,
      author: newReportData.author,
      isAnonymous: newReportData.isAnonymous,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      upvotes: 1,
      upvotedByUser: true,
      agency: 'Dinas Terkait (Dalam Verifikasi)',
      estimatedFixTime: 'Respon Maks. 24 Jam',
      image: newReportData.image,
      beforeImage: newReportData.image,
      afterImage: null,
      timeline: [
        { 
          step: 1, 
          title: 'Laporan Diterima', 
          date: 'Baru saja', 
          done: true, 
          desc: 'Laporan terdaftar secara resmi di sistem CivicPulse.' 
        },
        { 
          step: 2, 
          title: 'Verifikasi Dinas', 
          date: 'Dalam Antrean', 
          done: false, 
          desc: 'Pengungahan berkas ke instansi dinas teknis terkait.' 
        },
        { 
          step: 3, 
          title: 'Petugas Meluncur', 
          date: 'Menunggu', 
          done: false, 
          desc: 'Penugasan tim inspeksi dan perbaikan lapangan.' 
        },
        { 
          step: 4, 
          title: 'Perbaikan Selesai', 
          date: 'Menunggu', 
          done: false, 
          desc: 'Proses pengerjaan dan konfirmasi perbaikan dari warga.' 
        }
      ]
    };

    setReports([newReport, ...reports]);
    showToast(
      'Laporan Berhasil Diterbitkan 🎉',
      `Nomor Tiket Anda: #${newId}. Simpan nomor tiket ini untuk memantau progres.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-lg flex items-start gap-2.5 animate-in slide-in-from-top-3 duration-200 text-xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="font-bold text-slate-900 dark:text-white">{toastMessage.title}</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-normal">{toastMessage.message}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
          
          {/* Main View Router */}
          {activeTab === 'analytics' ? (
            <AnalyticsDashboard reports={reports} theme={theme} />
          ) : viewMode === 'map' || activeTab === 'map' ? (
            <InteractiveMap
              reports={filteredReports}
              onUpvote={handleUpvote}
              onTrackTicket={handleTrackTicket}
            />
          ) : (
            <ReportFeed
              reports={filteredReports}
              onUpvote={handleUpvote}
              onTrackTicket={handleTrackTicket}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
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
