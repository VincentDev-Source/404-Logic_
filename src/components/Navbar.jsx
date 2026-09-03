import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  BarChart3, 
  PlusCircle, 
  ShieldCheck, 
  Ticket, 
  Sun, 
  Moon, 
  Lock, 
  UserCheck, 
  Newspaper, 
  Heart,
  Menu,
  X,
  ChevronRight,
  Search,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenCreateModal, 
  onOpenTrackerModal,
  quickTicketInput,
  setQuickTicketInput,
  onSearchTicket,
  theme,
  setTheme,
  onLockFaceAuth,
  onOpenOperatorPortal,
  onOpenDonationModal
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTicketInput, setMenuTicketInput] = useState('');

  // Close drawer on ESC key and prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleTicketFormSubmit = (e) => {
    e.preventDefault();
    if (quickTicketInput.trim()) {
      onSearchTicket(quickTicketInput.trim());
    }
  };

  const handleMenuTicketSubmit = (e) => {
    e.preventDefault();
    if (menuTicketInput.trim()) {
      onSearchTicket(menuTicketInput.trim());
      setMenuTicketInput('');
      setIsMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    {
      id: 'feed',
      label: 'Semua Laporan',
      desc: 'Pantau laporan fasilitas publik dan tindak lanjut dinas',
      icon: ShieldCheck,
      badge: 'Utama',
    },
    {
      id: 'news',
      label: 'Berita Kota',
      desc: 'Informasi kebencanaan BMKG dan tata kelola fasilitas kota',
      icon: Newspaper,
      badge: 'Update',
    },
    {
      id: 'map',
      label: 'Peta Radar',
      desc: 'Sebaran titik aduan dan infrastruktur berbasis GPS',
      icon: MapPin,
      badge: 'Geospatial',
    },
    {
      id: 'analytics',
      label: 'Analitik SDG',
      desc: 'Indeks kepuasan penanganan & target capaian SDG 11',
      icon: BarChart3,
      badge: 'Metrik',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Brand Logo & Tagline */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group" 
              onClick={() => {
                setActiveTab('feed');
                setIsMenuOpen(false);
              }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="font-black text-sm sm:text-lg tracking-tight text-neutral-900 dark:text-white truncate">
                    CivicPulse
                  </span>
                  <span className="px-1 py-0.5 text-[9px] sm:text-[10px] font-mono font-black rounded bg-emerald-500 text-black shrink-0">
                    SDG 11
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate hidden sm:block">
                  Lapor Kota & Fasilitas Publik
                </p>
              </div>
            </div>

            {/* Extra-Wide Desktop Navigation Tabs (Hidden on Laptop to prevent crowding, accessible via Hamburger) */}
            <nav className="hidden 2xl:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-500 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800 shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              
              {/* Donation Button (Midtrans - Visible only on very wide desktop) */}
              {onOpenDonationModal && (
                <button
                  onClick={onOpenDonationModal}
                  className="hidden 2xl:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-amber-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-xs font-black items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  title="Donasi Pembangunan & Mitigasi Kota (Midtrans Sandbox)"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>Donasi</span>
                </button>
              )}

              {/* Quick Ticket Input Form (Extra-wide desktop only) */}
              <form onSubmit={handleTicketFormSubmit} className="hidden 2xl:block relative">
                <input
                  type="text"
                  placeholder="Lacak Tiket #..."
                  value={quickTicketInput}
                  onChange={(e) => setQuickTicketInput(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-32 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono font-medium"
                />
                <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </form>

              {/* Ticket Tracker Trigger (Desktop only) */}
              <button
                onClick={onOpenTrackerModal}
                className="hidden xl:flex p-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95"
                title="Lacak Tiket Laporan"
              >
                <Ticket className="w-4 h-4" />
              </button>

              {/* Theme Toggle (Mobile & Laptop & Desktop) */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-700" />
                )}
              </button>

              {/* Lock / Logout Face Auth Button (Desktop only) */}
              {onLockFaceAuth && (
                <button
                  onClick={onLockFaceAuth}
                  className="hidden 2xl:flex p-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95 items-center justify-center"
                  title="Kunci Aplikasi / Logout Face Auth"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              {/* Operator Portal Entry Button (Visible on mobile replacing 'Buat Aduan', and on desktop) */}
              {onOpenOperatorPortal && (
                <button
                  onClick={onOpenOperatorPortal}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
                  title="Portal Petugas / Verifikator"
                >
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Petugas</span>
                </button>
              )}

              {/* CTA Button (Desktop & Laptop only; hidden on mobile because mobile uses bottom CurvedNavbar) */}
              <button
                onClick={onOpenCreateModal}
                className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow items-center gap-1 sm:gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Aduan</span>
              </button>

              {/* Interactive Hamburger Navbar Button (Optimized for Laptop DPI & Responsive Navigation) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 shadow-sm shrink-0 ${
                  isMenuOpen
                    ? 'bg-emerald-500 text-black border-emerald-500 shadow-emerald-500/20 shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500/50'
                }`}
                aria-label="Toggle Interactive Menu"
                title="Buka Menu Navigasi & Layanan Kota"
              >
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex flex-col justify-center items-center gap-1">
                  <span className={`h-0.5 w-4 bg-current rounded-full transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`h-0.5 w-4 bg-current rounded-full transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`h-0.5 w-4 bg-current rounded-full transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
                <span className="text-xs font-extrabold hidden md:inline-block">
                  {isMenuOpen ? 'Tutup' : 'Menu'}
                </span>
              </button>

            </div>

          </div>

          {/* Mobile Horizontal Scrollable Tab Pills (Always visible on mobile screens!) */}
          <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-neutral-200/60 dark:border-neutral-800/60 no-scrollbar">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                activeTab === 'feed'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Semua Laporan</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                activeTab === 'news'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3 h-3" />
              <span>📰 Berita Kota</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Peta Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Analitik SDG</span>
            </button>

            {onOpenDonationModal && (
              <button
                onClick={onOpenDonationModal}
                className="px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1"
              >
                <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                <span>Donasi</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Interactive Slide-Over Drawer for Laptop & Desktop DPI */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute inset-y-0 right-0 max-w-full flex pl-10"
            >
              <div className="w-screen max-w-md bg-white dark:bg-[#0a0a0a] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between overflow-hidden">
                
                {/* Drawer Top Header */}
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black shadow-md">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm tracking-tight text-neutral-900 dark:text-white">
                          CivicPulse Navigation
                        </h3>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          SDG 11
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Menu Navigasi & Layanan Cepat
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="Tutup Menu (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Drawer Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                  
                  {/* Quick Ticket Tracker Form directly in Hamburger Drawer */}
                  <div className="bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Lacak Progres Tiket Aduan</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Real-time</span>
                    </div>

                    <form onSubmit={handleMenuTicketSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Masukkan #LP-2026-XXXX..."
                        value={menuTicketInput}
                        onChange={(e) => setMenuTicketInput(e.target.value)}
                        className="w-full pl-8 pr-20 py-2 rounded-xl bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-mono font-medium"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                      <button
                        type="submit"
                        className="absolute right-1 top-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] transition-colors shadow"
                      >
                        Lacak
                      </button>
                    </form>
                  </div>

                  {/* Section 1: Halaman Navigasi Utama */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 px-1 block">
                      Halaman Navigasi
                    </span>

                    <div className="space-y-1.5">
                      {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMenuOpen(false);
                            }}
                            className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all group ${
                              isActive
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isActive
                                  ? 'bg-emerald-500 text-black shadow-md'
                                  : 'bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 group-hover:text-emerald-500 border border-neutral-200 dark:border-neutral-800'
                              }`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold leading-tight">
                                    {item.label}
                                  </h4>
                                  {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  )}
                                </div>
                                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </div>

                            <ChevronRight className={`w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform ${
                              isActive ? 'text-emerald-500' : ''
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Layanan Publik & Aksi Cepat */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 px-1 block">
                      Aksi & Layanan Terpadu
                    </span>

                    <div className="space-y-2">
                      
                      {/* Donasi Crowdfunding Midtrans Card */}
                      {onOpenDonationModal && (
                        <div 
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenDonationModal();
                          }}
                          className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-neutral-900 to-amber-950/40 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all shadow-sm group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow">
                                <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
                              </div>
                              <span className="text-xs font-black text-white group-hover:text-rose-400 transition-colors">
                                Donasi Pembangunan & Bencana
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                              MIDTRANS
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 leading-relaxed">
                            Salurkan partisipasi warga untuk bantuan cepat perbaikan fasilitas publik kota.
                          </p>
                        </div>
                      )}

                      {/* Portal Petugas Button */}
                      {onOpenOperatorPortal && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenOperatorPortal();
                          }}
                          className="w-full p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-600 dark:text-blue-400 flex items-center justify-between transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold leading-tight">
                                Portal Masuk Petugas Lapangan
                              </h4>
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                Login operator dinas teknis & pemantauan status
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                      {/* Lacak Tiket Modal Launcher */}
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenTrackerModal();
                        }}
                        className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-700 dark:text-neutral-300 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-black text-emerald-500 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                            <Ticket className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold leading-tight">
                              Pelacak Status Aduan Real-Time
                            </h4>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              Lihat riwayat perbaikan dan rating dinas
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Lock Face Auth Action */}
                      {onLockFaceAuth && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onLockFaceAuth();
                          }}
                          className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold leading-tight">
                                Kunci Aplikasi / Logout Wajah
                              </h4>
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                Kunci sesi Face Auth biometrik perangkat
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}

                    </div>
                  </div>

                </div>

                {/* Drawer Footer Tools */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
                  
                  {/* Theme Selector inside Drawer */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-neutral-400" /> : <Sun className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>Mode Tampilan</span>
                    </span>

                    <button
                      onClick={toggleTheme}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-black font-extrabold text-[11px] shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 transition-colors"
                    >
                      {theme === 'dark' ? '☀️ Terang' : '🌙 Gelap'}
                    </button>
                  </div>

                  {/* System Status & SDG 11 Footer Note */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 font-mono">
                    <span>SDG Target 11.1 & 11.5</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Sistem Real-Time
                    </span>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
