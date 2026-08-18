import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Newspaper, 
  ShieldAlert, 
  Building2, 
  ExternalLink, 
  ChevronDown, 
  Clock, 
  Sparkles,
  AlertCircle,
  Filter,
  Globe,
  Loader2
} from 'lucide-react';
import { 
  detectUserLocation, 
  getCityFallback, 
  POPULAR_CITIES, 
  DEFAULT_CITY 
} from '../utils/geolocation';

export default function CityNewsWidget() {
  const [cityData, setCityData] = useState({
    city: DEFAULT_CITY,
    fullName: 'DKI Jakarta',
    isFallback: true,
    coordinates: null
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [news, setNews] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua'); // 'Semua' | 'Bencana & Cuaca' | 'Tata Kota & Aduan'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Fetch News Function for given city
  const fetchNews = useCallback(async (cityName, isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshingNews(true);
    else setIsLoadingNews(true);
    setError(null);

    try {
      const res = await fetch(`/api/news?city=${encodeURIComponent(cityName)}`);
      if (!res.ok) {
        throw new Error(`Gagal mengambil berita (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setNews(data.articles);
      } else {
        throw new Error('Format respon berita tidak valid');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Gagal memuat berita lokal.');
    } finally {
      setIsLoadingNews(false);
      setIsRefreshingNews(false);
    }
  }, []);

  // 2. Initial Location Detection & News Fetch
  const handleAutoDetectLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const location = await detectUserLocation();
      setCityData(location);
      await fetchNews(location.city);
    } catch (err) {
      console.error('Location detection failed:', err);
      const fallback = getCityFallback(DEFAULT_CITY);
      setCityData(fallback);
      await fetchNews(DEFAULT_CITY);
    } finally {
      setIsDetectingLocation(false);
    }
  }, [fetchNews]);

  useEffect(() => {
    handleAutoDetectLocation();
  }, [handleAutoDetectLocation]);

  // 3. Handle Manual City Change
  const handleCitySelect = async (selectedName) => {
    setIsDropdownOpen(false);
    const fallback = getCityFallback(selectedName);
    setCityData(fallback);
    await fetchNews(fallback.city);
  };

  // 4. Filter articles based on active category tab
  const filteredArticles = news.filter((art) => {
    if (activeCategory === 'Semua') return true;
    return art.category === activeCategory;
  });

  // Relative time helper
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Baru saja';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'Baru saja';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <div className="w-full mb-6">
      <div className="bg-[#09090b] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300">
        
        {/* Dynamic Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5 mb-5">
          
          {/* Title & Detected Location Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                GEO-TARGETED NEWS (SDG 11)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {cityData.isFallback ? '📍 Mode Manual / Preset' : '🎯 Deteksi GPS Akurat'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap pt-0.5">
              <span>📍 Berita Terkini {cityData.fullName || cityData.city} & Sekitarnya</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Kanal agregasi informasi kebencanaan, peringatan cuaca BMKG, dan perkembangan tata kota real-time.
            </p>
          </div>

          {/* Location Actions & Manual City Selector */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            
            {/* Auto Detect Location Button */}
            <button
              onClick={handleAutoDetectLocation}
              disabled={isDetectingLocation}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              title="Deteksi Lokasi GPS Otomatis"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>{isDetectingLocation ? 'Mendeteksi...' : 'Lokasi Saya'}</span>
            </button>

            {/* Manual City Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{cityData.city}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setIsDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-30 overflow-hidden py-1 max-h-60 overflow-y-auto"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 border-b border-neutral-800">
                        PILIH KOTA SECARA MANUAL
                      </div>
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleCitySelect(c.name)}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                            cityData.city.toLowerCase() === c.name.toLowerCase()
                              ? 'bg-emerald-950/60 text-emerald-400 font-bold'
                              : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className="text-[10px] text-neutral-500">{c.fullName.split(',')[1] || ''}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchNews(cityData.city, true)}
              disabled={isRefreshingNews || isLoadingNews}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/80 transition-all active:scale-95 disabled:opacity-50"
              title="Muat Ulang Berita Kota"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingNews ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

          </div>

        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'Semua', label: 'Semua Berita', icon: Globe },
            { id: 'Bencana & Cuaca', label: 'Bencana & Cuaca', icon: ShieldAlert },
            { id: 'Tata Kota & Aduan', label: 'Tata Kota & Aduan', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skeleton Loading State */}
        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 animate-pulse space-y-3"
              >
                <div className="w-full h-40 bg-neutral-800 rounded-xl" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-neutral-800 rounded-lg" />
                  <div className="h-4 w-16 bg-neutral-800 rounded-lg" />
                </div>
                <div className="h-5 w-full bg-neutral-800 rounded-lg" />
                <div className="h-4 w-5/6 bg-neutral-800 rounded-lg" />
                <div className="h-8 w-full bg-neutral-800 rounded-xl pt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State UI */
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-xs text-red-400 font-bold">{error}</p>
            <button
              onClick={() => fetchNews(cityData.city, true)}
              className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Muat Berita Lagi</span>
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty Articles State */
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 text-center space-y-2">
            <Newspaper className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 font-bold">Tidak ada berita untuk kategori "{activeCategory}".</p>
          </div>
        ) : (
          /* Staggered News Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredArticles.map((article) => {
              const isDisaster = article.category === 'Bencana & Cuaca';
              return (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Article Card Content */}
                  <div>
                    {/* Thumbnail Image Container */}
                    <div className="relative w-full h-44 overflow-hidden bg-black">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = isDisaster
                            ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
                            : 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      
                      {/* Top Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md shadow-md ${
                          isDisaster
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        }`}>
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Meta Info & Title */}
                    <div className="p-4 space-y-2">
                      {/* Media Source & Time */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-bold text-neutral-300 flex items-center gap-1 truncate max-w-[60%]">
                          <Newspaper className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{article.source}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(article.publishedAt)}</span>
                        </span>
                      </div>

                      {/* Title with hover underline */}
                      <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Description Summary (line-clamp-2) */}
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-0">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-emerald-600 text-neutral-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                    >
                      <span>Baca Selengkapnya</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </div>
  );
}
