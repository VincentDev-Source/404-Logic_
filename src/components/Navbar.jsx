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
  Moon
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
  setTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (quickTicketInput.trim()) {
      onSearchTicket(quickTicketInput.trim());
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & SDG 11 Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Civic<span className="text-emerald-400">Pulse</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LaporKota
                </span>
              </div>
              <p className="text-[11px] text-slate-300 dark:text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SDG 11: Kota & Komunitas Berkelanjutan
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-700 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Beranda & Feed
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Peta Laporan
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Statistik Kota
            </button>
          </nav>

          {/* Quick Actions, Theme Toggle & CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Quick Ticket Tracker Form */}
            <form onSubmit={handleTicketSubmit} className="relative">
              <input
                type="text"
                placeholder="Cek Tiket #LP-..."
                value={quickTicketInput}
                onChange={(e) => setQuickTicketInput(e.target.value)}
                className="w-36 xl:w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700 dark:border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Ticket className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={onOpenTrackerModal}
              className="p-2 text-slate-300 hover:text-emerald-400 bg-slate-800/80 dark:bg-slate-900/80 hover:bg-slate-700 border border-slate-700 dark:border-slate-800 rounded-xl transition-all"
              title="Lacak Tiket Laporan"
            >
              <Ticket className="w-4 h-4" />
            </button>

            {/* Theme Switcher Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-amber-300 bg-slate-800/80 dark:bg-slate-900/80 hover:bg-slate-700 border border-slate-700 dark:border-slate-800 rounded-xl transition-all flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Simple Clean CTA Button */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Aduan</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 dark:bg-slate-900 border border-slate-700 text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lapor
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 dark:bg-slate-900 border border-slate-700 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 text-xs">
          <button
            onClick={() => { setActiveTab('feed'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
              activeTab === 'feed' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Beranda & Feed Aduan
          </button>
          
          <button
            onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
              activeTab === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Peta Laporan Interaktif
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Statistik Kota Cerdas
          </button>

          <button
            onClick={() => { onOpenTrackerModal(); setMobileMenuOpen(false); }}
            className="w-full px-3 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-slate-300 hover:bg-slate-800"
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            Cek Tiket Status
          </button>
        </div>
      )}
    </header>
  );
}
