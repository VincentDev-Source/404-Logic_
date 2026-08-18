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
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                  Civic<span className="text-emerald-500">Pulse</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800">
                  LaporKota
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                SDG 11: Kota & Komunitas Berkelanjutan
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Beranda & Feed
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Peta Laporan
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Statistik Kota
            </button>
          </nav>

          {/* Quick Actions & Theme Switcher */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Quick Ticket Search */}
            <form onSubmit={handleTicketSubmit} className="relative">
              <input
                type="text"
                placeholder="Cek Tiket #LP-..."
                value={quickTicketInput}
                onChange={(e) => setQuickTicketInput(e.target.value)}
                className="w-36 xl:w-44 pl-8 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500"
              />
              <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={onOpenTrackerModal}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all"
              title="Lacak Tiket Laporan"
            >
              <Ticket className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Aduan</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            <button
              onClick={onOpenCreateModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lapor
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 pt-3 pb-6 space-y-2 text-xs">
          <button
            onClick={() => { setActiveTab('feed'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === 'feed' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            Beranda & Feed Aduan
          </button>
          
          <button
            onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === 'map' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            Peta Laporan Interaktif
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-emerald-500 text-black' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            Statistik Kota Cerdas
          </button>

          <button
            onClick={() => { onOpenTrackerModal(); setMobileMenuOpen(false); }}
            className="w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Ticket className="w-4 h-4 text-emerald-500" />
            Cek Tiket Status
          </button>
        </div>
      )}
    </header>
  );
}
