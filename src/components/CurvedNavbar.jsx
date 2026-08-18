import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  BarChart3, 
  UserCheck, 
  Lock 
} from 'lucide-react';

export default function CurvedNavbar({ 
  activeTab = 'home', 
  onTabChange,
  onOpenCreateModal,
  onOpenTrackerModal,
  onOpenOperatorPortal,
  onLockFaceAuth
}) {

  // 5 Tab items with labels & custom SVG icons
  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'search',
      label: 'Peta',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      id: 'create',
      label: 'Lapor',
      isCenter: true,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
    {
      id: 'like',
      label: 'Analitik',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Petugas',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'create') {
      if (onOpenCreateModal) onOpenCreateModal();
    } else if (tabId === 'profile') {
      if (onOpenOperatorPortal) onOpenOperatorPortal();
    } else {
      if (onTabChange) onTabChange(tabId);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[430px] pointer-events-auto">
      
      {/* Main Curved Glassmorphism Container */}
      <div className="relative bg-black/90 text-white backdrop-blur-2xl border border-neutral-800/80 rounded-[32px] px-3 py-2 shadow-2xl flex items-center justify-between">
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-2 z-10 transition-colors focus:outline-none"
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
                  className="absolute -top-7 w-14 h-14 bg-black border-2 border-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-emerald-400 z-20"
                >
                  {/* Glowing Ring Effect */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                  <div className="relative z-10">
                    {tab.icon}
                  </div>
                </motion.div>
              )}

              {/* Icon (Dimmed when inactive, invisible inside bar when active because it rises into bubble) */}
              <div className={`transition-all duration-300 ${isActive ? 'opacity-0 scale-75' : 'text-white/60 hover:text-white scale-100'}`}>
                {tab.icon}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-extrabold mt-1 tracking-tight transition-all duration-300 ${
                isActive ? 'text-emerald-400 font-black' : 'text-white/50'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
