import React, { useState } from 'react';
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
  Plus,
  X,
  Sparkles,
  FileText
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
  onOpenOperatorPortal
}) {
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const handleTicketFormSubmit = (e) => {
    e.preventDefault();
    if (quickTicketInput.trim()) {
      onSearchTicket(quickTicketInput.trim());
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Brand Logo & Tagline */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group" onClick={() => setActiveTab('feed')}>
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

            {/* Navigation Tabs (Visible on Tablet & Desktop) */}
            <nav className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
                  activeTab === 'feed'
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-500 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Semua Laporan</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
                  activeTab === 'map'
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-500 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Peta Radar</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-500 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analitik SDG</span>
              </button>
            </nav>

            {/* Header Right Actions (Tablet & Desktop) */}
            <div className="flex items-center space-x-2">
              
              {/* Operator Portal Entry Button */}
              {onOpenOperatorPortal && (
                <button
                  onClick={onOpenOperatorPortal}
                  className="hidden sm:flex px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 text-xs font-extrabold items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Petugas</span>
                </button>
              )}

              {/* Quick Ticket Input Form (Desktop) */}
              <form onSubmit={handleTicketFormSubmit} className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Lacak Tiket #..."
                  value={quickTicketInput}
                  onChange={(e) => setQuickTicketInput(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-32 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono font-medium"
                />
                <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </form>

              {/* Ticket Tracker Modal Trigger */}
              <button
                onClick={onOpenTrackerModal}
                className="hidden sm:flex p-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95"
                title="Lacak Tiket Laporan"
              >
                <Ticket className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-700" />
                )}
              </button>

              {/* Lock / Logout Face Auth Button (Tablet & Desktop) */}
              {onLockFaceAuth && (
                <button
                  onClick={onLockFaceAuth}
                  className="hidden sm:flex p-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95 items-center justify-center"
                  title="Kunci Aplikasi / Logout Face Auth"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              {/* CTA Button (Tablet & Desktop) */}
              <button
                onClick={onOpenCreateModal}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow items-center gap-1.5 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Aduan</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 
        ========================================================================
        SMARTPHONE ANIMATED FLOATING GLASSMORPHISM DOCK WITH 100% CENTERED (+)
        ========================================================================
      */}
      <div className="sm:hidden fixed bottom-4 inset-x-3 max-w-sm mx-auto z-50 pointer-events-auto">
        
        {/* Backdrop overlay when speed dial menu is open */}
        {speedDialOpen && (
          <div
            onClick={() => setSpeedDialOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          />
        )}

        {/* Expandable Speed-Dial Floating Menu Popup */}
        {speedDialOpen && (
          <div className="absolute bottom-16 inset-x-0 z-50 bg-neutral-900/95 dark:bg-black/95 border border-neutral-800 rounded-3xl p-3 shadow-2xl backdrop-blur-2xl space-y-2 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800 text-[10px] font-extrabold text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                PILIH OPSI FITUR LAPORAN
              </span>
              <button onClick={() => setSpeedDialOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs font-bold pt-1">
              <button
                onClick={() => { setSpeedDialOpen(false); onOpenCreateModal(); }}
                className="w-full p-2.5 rounded-2xl bg-emerald-500 text-black font-extrabold flex items-center justify-between shadow active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Aduan Publik Baru</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">+Lapor</span>
              </button>

              <button
                onClick={() => { setSpeedDialOpen(false); onOpenTrackerModal(); }}
                className="w-full p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span>Lacak Nomor Tiket Laporan</span>
                </div>
                <span className="text-[10px] text-neutral-400">#LP-2026</span>
              </button>

              {onOpenOperatorPortal && (
                <button
                  onClick={() => { setSpeedDialOpen(false); onOpenOperatorPortal(); }}
                  className="w-full p-2.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Portal Petugas (Biometrik Wajah)</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">SDG 11</span>
                </button>
              )}

              <button
                onClick={() => { setSpeedDialOpen(false); setActiveTab('analytics'); }}
                className="w-full p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Dashboard Analitik SDG 11</span>
                </div>
                <span className="text-[10px] text-neutral-400">Statistik</span>
              </button>

              {onLockFaceAuth && (
                <button
                  onClick={() => { setSpeedDialOpen(false); onLockFaceAuth(); }}
                  className="w-full p-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Kunci Aplikasi / Logout Face Auth</span>
                  </div>
                  <span className="text-[10px] text-red-400">Lock 🔒</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 
          FLOATING DOCK BAR: 5 Main items for 100% mathematical center alignment!
          Item 1: Beranda
          Item 2: Peta
          Item 3: (+) Center Action Hub (MATHEMATICALLY CENTERED!)
          Item 4: Analitik
          Item 5: Kunci
        */}
        <div className="relative z-50 bg-neutral-950/90 dark:bg-black/90 backdrop-blur-2xl border border-neutral-800/80 rounded-full p-1.5 shadow-2xl flex items-center justify-between text-[9px] font-extrabold text-white">
          
          {/* Item 1: Beranda */}
          <button
            onClick={() => { setSpeedDialOpen(false); setActiveTab('feed'); }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'feed' ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          {/* Item 2: Peta */}
          <button
            onClick={() => { setSpeedDialOpen(false); setActiveTab('map'); }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'map' ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Peta</span>
          </button>

          {/* Item 3: (+) CENTER ACTION HUB (100% MATHEMATICALLY CENTERED IN DOCK) */}
          <div className="flex-1 flex items-center justify-center -my-3">
            <button
              onClick={() => setSpeedDialOpen(!speedDialOpen)}
              className={`w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-neutral-950 transition-transform duration-300 active:scale-90 ${
                speedDialOpen ? 'rotate-45 bg-emerald-400' : 'hover:scale-110 animate-pulse'
              }`}
              title="Menu Aksi Cepat"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Item 4: Analitik */}
          <button
            onClick={() => { setSpeedDialOpen(false); setActiveTab('analytics'); }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'analytics' ? 'text-emerald-400 font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analitik</span>
          </button>

          {/* Item 5: Kunci */}
          {onLockFaceAuth ? (
            <button
              onClick={() => { setSpeedDialOpen(false); onLockFaceAuth(); }}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full text-red-400 hover:text-red-300 transition-all active:scale-95"
              title="Kunci Aplikasi"
            >
              <Lock className="w-4 h-4" />
              <span>Kunci</span>
            </button>
          ) : (
            <button
              onClick={() => setSpeedDialOpen(!speedDialOpen)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full text-neutral-400 hover:text-white transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Menu</span>
            </button>
          )}

        </div>
      </div>
    </>
  );
}
