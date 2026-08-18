import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BarChart3, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck,
  Ticket,
  Sun,
  Moon,
  Lock,
  UserCheck
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-tight text-neutral-900 dark:text-white">
                  CivicPulse
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-black rounded bg-emerald-500 text-black">
                  SDG 11
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Lapor Kota & Fasilitas Publik</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-500 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analitik SDG</span>
            </button>
          </nav>

          {/* Quick Actions Bar */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {/* Operator Portal Entry Button */}
            {onOpenOperatorPortal && (
              <button
                onClick={onOpenOperatorPortal}
                className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk Petugas</span>
              </button>
            )}

            {/* Quick Ticket Input Form */}
            <form onSubmit={handleTicketFormSubmit} className="relative">
              <input
                type="text"
                placeholder="Lacak Tiket #..."
                value={quickTicketInput}
                onChange={(e) => setQuickTicketInput(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-32 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono font-medium"
              />
              <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={onOpenTrackerModal}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95"
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

            {/* Lock / Logout Face Auth Button */}
            {onLockFaceAuth && (
              <button
                onClick={onLockFaceAuth}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                title="Kunci Aplikasi / Logout Face Auth"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* CTA Button */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Aduan</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {onOpenOperatorPortal && (
              <button
                onClick={onOpenOperatorPortal}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30 text-xs font-bold active:scale-95"
              >
                Petugas
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 active:scale-95"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            <button
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lapor
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 space-y-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('feed'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'feed' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Semua Laporan</span>
          </button>

          <button
            onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'map' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Peta Radar</span>
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analitik SDG</span>
          </button>

          {onOpenOperatorPortal && (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenOperatorPortal(); }}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-blue-400 bg-blue-500/10 border border-blue-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Portal Masuk Petugas (Biometrik Wajah)</span>
            </button>
          )}

          {onLockFaceAuth && (
            <button
              onClick={() => { setMobileMenuOpen(false); onLockFaceAuth(); }}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <Lock className="w-4 h-4" />
              <span>Kunci Aplikasi / Logout Face Auth</span>
            </button>
          )}
        </div>
      )}

    </header>
  );
}
