import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BarChart3, 
  PlusCircle, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  Ticket
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenCreateModal, 
  onOpenTrackerModal,
  searchQuery,
  setSearchQuery,
  quickTicketInput,
  setQuickTicketInput,
  onSearchTicket
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (quickTicketInput.trim()) {
      onSearchTicket(quickTicketInput.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & SDG 11 Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Pulse</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LaporKota
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SDG 11: Kota & Komunitas Berkelanjutan
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Beranda & Feed
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Peta Laporan
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistik Kota
            </button>
          </nav>

          {/* Quick Actions & Cek Tiket Search */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Quick Ticket Tracker Form */}
            <form onSubmit={handleTicketSubmit} className="relative">
              <input
                type="text"
                placeholder="Cek Tiket #LP-..."
                value={quickTicketInput}
                onChange={(e) => setQuickTicketInput(e.target.value)}
                className="w-40 xl:w-48 pl-8 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <Ticket className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={onOpenTrackerModal}
              className="p-2 text-slate-300 hover:text-emerald-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
              title="Lacak Tiket Laporan"
            >
              <Ticket className="w-4 h-4" />
            </button>

            {/* Pulsing CTA Button */}
            <button
              onClick={onOpenCreateModal}
              className="relative group overflow-hidden px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Lapor Sekarang</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/30"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Lapor
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('feed'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                activeTab === 'feed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300'
              }`}
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              Beranda & Feed Aduan
            </button>
            
            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                activeTab === 'map' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300'
              }`}
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              Peta Laporan Interaktif
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300'
              }`}
            >
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Statistik Kota Cerdas
            </button>

            <button
              onClick={() => { onOpenTrackerModal(); setMobileMenuOpen(false); }}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-slate-300 hover:bg-slate-900"
            >
              <Ticket className="w-5 h-5 text-sky-400" />
              Cek Tiket & Lacak Progress
            </button>
          </div>

          {/* Mobile Ticket Search Form */}
          <form onSubmit={(e) => { handleTicketSubmit(e); setMobileMenuOpen(false); }} className="pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan No. Tiket #LP-2026-..."
                value={quickTicketInput}
                onChange={(e) => setQuickTicketInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500"
              />
              <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
