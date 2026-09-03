import React from 'react';
import { motion } from 'framer-motion';
import { Home, Newspaper, Plus, Search, Ticket } from 'lucide-react';

export default function CurvedNavbar({ 
  activeTab = 'home', 
  onTabChange,
  onOpenCreateModal,
  onOpenTrackerModal,
  onOpenOperatorPortal,
  onLockFaceAuth
}) {

  const tabs = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-6 h-6" /> },
    { id: 'news', label: 'Berita', icon: <Newspaper className="w-6 h-6" /> },
    { id: 'create', label: 'Lapor', isCenter: true, icon: <Plus className="w-7 h-7" strokeWidth={2.5} /> },
    { id: 'search', label: 'Peta', icon: <Search className="w-6 h-6" /> },
    { id: 'ticket', label: 'Tiket', icon: <Ticket className="w-6 h-6" /> },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'create') {
      if (onOpenCreateModal) onOpenCreateModal();
    } else if (tabId === 'ticket') {
      if (onOpenTrackerModal) onOpenTrackerModal();
    } else {
      if (onTabChange) onTabChange(tabId);
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[420px] pointer-events-auto"
      style={{ bottom: 'calc(0.85rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Main Curved Glassmorphism Container */}
      <div className="relative bg-black/90 text-white backdrop-blur-2xl border border-neutral-800/80 rounded-[28px] sm:rounded-[32px] px-2 sm:px-3 py-1.5 sm:py-2 shadow-2xl flex items-center justify-between">
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 z-10 transition-transform active:scale-90 focus:outline-none min-h-[44px] select-none"
              aria-label={tab.label}
            >
              {/* Floating Spring Bubble Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeBubble"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 30,
                  }}
                  className="absolute -top-6 sm:-top-7 w-12 h-12 sm:w-14 sm:h-14 bg-black border-2 border-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-emerald-400 z-20"
                >
                  {/* Glowing Ring Effect */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                    {tab.icon}
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`transition-all duration-300 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 ${
                isActive ? 'opacity-0 scale-75' : 'text-white/60 hover:text-white scale-100'
              }`}>
                {tab.icon}
              </div>

              {/* Label */}
              <span className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 sm:mt-1 tracking-tight transition-all duration-300 truncate max-w-full ${
                isActive ? 'text-emerald-400 font-black' : 'text-white/50'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}

      </div>
    </nav>
  );
}
