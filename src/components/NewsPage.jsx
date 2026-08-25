import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Sparkles,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Bookmark,
  ChevronDown,
  Clock,
  ExternalLink,
  Flame,
  Volume2,
  Filter,
  ShieldCheck,
  Building2,
  ShieldAlert,
  Globe,
  Loader2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X,
  Share2,
  TrendingUp,
  Radio,
  FileText
} from 'lucide-react';
import {
  detectUserLocation,
  getCityFallback,
  POPULAR_CITIES,
  DEFAULT_CITY
} from '../utils/geolocation';
import { INDONESIAN_CITIES, normalizeCityName } from '../data/indonesianCities';
import EarthquakeAlert from './EarthquakeAlert';
import NewsReaderModal from './NewsReaderModal';
import NewsWeatherWidget from './NewsWeatherWidget';
import NewsPollWidget from './NewsPollWidget';

export default function NewsPage({
  onOpenReportModalWithContext,
  showToast,
  theme = 'dark'
}) {
  // 1. Location State
  const [cityData, setCityData] = useState({
    city: DEFAULT_CITY,
    fullName: 'DKI Jakarta',
    isFallback: true,
    coordinates: null
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchFilter, setCitySearchFilter] = useState('');

  // 2. News Data State
  const [news, setNews] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [error, setError] = useState(null);

  // 3. Filter & Search State
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru'); // 'terbaru' | 'populer' | 'relevan'

  // 4. Bookmarks State (persisted in localStorage)
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('civicpulse_bookmarked_news');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Reader Modal State
  const [activeReaderArticle, setActiveReaderArticle] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // 6. Fetch News from API
  const fetchNews = useCallback(async (cityName, isManual = false) => {
    if (isManual) setIsRefreshingNews(true);
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
        throw new Error('Format data berita tidak sesuai');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Gagal memuat berita terkini.');
    } finally {
      setIsLoadingNews(false);
      setIsRefreshingNews(false);
    }
  }, []);

  // 7. Auto Detect Location on Mount
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

  // 8. Handle City Select
  const handleCitySelect = (selectedName) => {
    setIsCityDropdownOpen(false);
    setCitySearchFilter('');
    const fallback = getCityFallback(selectedName);
    setCityData(fallback);
    fetchNews(fallback.city);
  };

  // 9. Bookmark Handler
  const handleToggleBookmark = (article) => {
    setBookmarkedArticles(prev => {
      const exists = prev.some(a => a.id === article.id);
      let updated;
      if (exists) {
        updated = prev.filter(a => a.id !== article.id);
        if (showToast) showToast('Dihapus dari Simpanan', 'Artikel telah dihapus dari daftar tersimpan Anda.', 'info');
      } else {
        updated = [article, ...prev];
        if (showToast) showToast('Artikel Disimpan ⭐', 'Artikel tersimpan dan dapat dibaca kapan saja pada tab Tersimpan.', 'success');
      }
      localStorage.setItem('civicpulse_bookmarked_news', JSON.stringify(updated));
      return updated;
    });
  };

  // 10. Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    let list = activeCategory === 'Tersimpan' ? bookmarkedArticles : news;

    // Filter by Category if not 'Semua' and not 'Tersimpan'
    if (activeCategory !== 'Semua' && activeCategory !== 'Tersimpan') {
      list = list.filter(art => art.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(art =>
        art.title.toLowerCase().includes(q) ||
        (art.description && art.description.toLowerCase().includes(q)) ||
        (art.tags && art.tags.some(t => t.toLowerCase().includes(q))) ||
        (art.source && art.source.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'populer') {
      return [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'relevan') {
      return [...list].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    // Default newest
    return [...list].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [news, bookmarkedArticles, activeCategory, searchQuery, sortBy]);

  // Featured Hero Article (First article in list)
  const featuredArticle = useMemo(() => {
    return news.length > 0 ? news[0] : null;
  }, [news]);

  // Relative Time Formatter
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Baru saja';
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'Baru saja';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j yang lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}h yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Filtered Cities for Search Dropdown
  const dropdownCityList = useMemo(() => {
    if (!citySearchFilter.trim()) return POPULAR_CITIES;
    const q = citySearchFilter.toLowerCase().trim();
    return INDONESIAN_CITIES.filter(c => 
      c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [citySearchFilter]);

  // Categories Definition
  const categories = [
    { id: 'Semua', label: 'Semua Berita', icon: Globe },
    { id: 'Bencana & Cuaca', label: 'Bencana & Cuaca', icon: ShieldAlert },
    { id: 'Tata Kota & Jalan', label: 'Tata Kota & Jalan', icon: Building2 },
    { id: 'Inovasi & Smart City', label: 'Inovasi & Smart City', icon: Sparkles },
    { id: 'Layanan Publik', label: 'Layanan Publik', icon: ShieldCheck },
    { id: 'Tersimpan', label: `Tersimpan (${bookmarkedArticles.length})`, icon: Bookmark }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Real-time BMKG Earthquake Early Warning Widget */}
      <EarthquakeAlert />

      {/* Breaking News Marquee Ticker */}
      <div className="w-full bg-[#09090b] border border-neutral-800 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-mono font-black shrink-0">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>BREAKING NEWS</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 text-xs text-neutral-300 font-medium">
          <div className="inline-block animate-marquee">
            📢 Informasi Kesiapsiagaan Kota: BPBD & BMKG memantau anomali cuaca di {cityData.city} • Laporan aduan perbaikan fasilitas umum dapat dikirimkan secara langsung via tombol Buat Aduan • Integrasi sensor IoT CivicPulse aktif 24/7.
          </div>
        </div>
      </div>

      {/* Hero Headline & Side Widgets Grid (2:1 Layout on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Featured Spotlight Article */}
        <div className="lg:col-span-2">
          {featuredArticle ? (
            <div className="group relative bg-[#09090b] border border-neutral-800 hover:border-neutral-700 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 h-full flex flex-col justify-between">
              
              {/* Hero Image with Gradient Overlays */}
              <div className="relative w-full aspect-video sm:aspect-[21/9] overflow-hidden bg-black">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black shadow-lg flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-black" />
                      HEADLINE UTAMA
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-black/70 backdrop-blur-md border border-neutral-700 text-neutral-200">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(featuredArticle);
                    }}
                    className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-neutral-700 text-neutral-200 hover:text-white transition-all active:scale-95"
                    title="Simpan Berita"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedArticles.some(b => b.id === featuredArticle.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Headline Body */}
              <div className="p-5 sm:p-7 space-y-3 -mt-6 sm:-mt-10 relative z-10">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5" />
                    {featuredArticle.source}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{formatRelativeTime(featuredArticle.publishedAt)}</span>
                  <span>•</span>
                  <span className="font-mono">{featuredArticle.readTime || '2 min baca'}</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {featuredArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                  {featuredArticle.description}
                </p>

                {/* Hero Actions */}
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      setActiveReaderArticle(featuredArticle);
                      setIsReaderOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Buka Reader Mode (AI & Audio)</span>
                  </button>

                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Sumber Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-64 bg-neutral-900/50 rounded-3xl border border-neutral-800 animate-pulse" />
          )}
        </div>

        {/* Right 1 Col: Live Weather & Air Quality + Citizen Poll */}
        <div className="space-y-6 flex flex-col justify-between">
          <NewsWeatherWidget city={cityData.city} />
          <NewsPollWidget city={cityData.city} showToast={showToast} />
        </div>

      </div>

      {/* Main News Directory & Filter Section */}
      <div className="bg-[#09090b] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* Section Header with Location Switcher & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
          
          {/* Title Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                PORTAL BERITA TERKINI & SDG 11
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {cityData.isFallback ? '📍 Pilihan Wilayah' : '🎯 GPS Terverifikasi'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              📰 Berita & Perkembangan Wilayah {cityData.fullName || cityData.city}
            </h2>
            <p className="text-xs text-neutral-400">
              Kanal agregasi berita terpercaya seputar infrastruktur, mitigasi bencana, inovasi teknologi publik, dan kebijakan kota.
            </p>
          </div>

          {/* Location & Refresh Controls */}
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

            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cityData.city}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsCityDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-40 overflow-hidden py-2"
                    >
                      {/* Search Filter Input inside Dropdown */}
                      <div className="px-3 pb-2 border-b border-neutral-800">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Cari Kota / Kabupaten..."
                            value={citySearchFilter}
                            onChange={(e) => setCitySearchFilter(e.target.value)}
                            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500"
                            autoFocus
                          />
                          <Search className="w-3 h-3 text-neutral-500 absolute left-2.5 top-2" />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {dropdownCityList.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleCitySelect(c.name)}
                            className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                              cityData.city.toLowerCase() === c.name.toLowerCase()
                                ? 'bg-emerald-950/80 text-emerald-400 font-bold'
                                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`}
                          >
                            <span>{c.name}</span>
                            <span className="text-[10px] text-neutral-500">{c.fullName ? c.fullName.split(',')[1] : c.province}</span>
                          </button>
                        ))}
                      </div>
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
              title="Muat Ulang Berita"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingNews ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

          </div>

        </div>

        {/* Filter Toolbar: Category Tabs + Search Bar + Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
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

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Cari judul / tagar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="terbaru">Terbaru</option>
              <option value="populer">Terpopuler (Views)</option>
              <option value="relevan">Terverifikasi</option>
            </select>
          </div>

        </div>

        {/* News Grid Area */}
        {isLoadingNews ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 animate-pulse space-y-3"
              >
                <div className="w-full h-44 bg-neutral-800 rounded-xl" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-neutral-800 rounded-lg" />
                  <div className="h-4 w-16 bg-neutral-800 rounded-lg" />
                </div>
                <div className="h-5 w-full bg-neutral-800 rounded-lg" />
                <div className="h-4 w-4/5 bg-neutral-800 rounded-lg" />
                <div className="h-9 w-full bg-neutral-800 rounded-xl pt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm text-red-400 font-bold">{error}</p>
            <button
              onClick={() => fetchNews(cityData.city, true)}
              className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Berita</span>
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty State */
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-12 text-center space-y-3">
            <Newspaper className="w-12 h-12 text-neutral-600 mx-auto" />
            <h4 className="text-sm font-extrabold text-white">Tidak ada artikel berita ditemukan</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              {activeCategory === 'Tersimpan'
                ? 'Anda belum memiliki artikel berita yang disimpan. Klik ikon bookmark pada berita untuk menyimpannya.'
                : `Tidak ada artikel untuk kategori "${activeCategory}" atau kata kunci "${searchQuery}".`}
            </p>
            {(activeCategory !== 'Semua' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategory('Semua');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all inline-block"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          /* Staggered Articles Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredArticles.map((article) => {
              const isDisaster = article.category === 'Bencana & Cuaca';
              const isBookmarked = bookmarkedArticles.some(b => b.id === article.id);

              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
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

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border backdrop-blur-md shadow-md ${
                          isDisaster
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        }`}>
                          {article.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(article);
                          }}
                          className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95"
                          title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Berita'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Read Time & Views Overlay */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-neutral-300 font-mono">
                          {article.readTime || '2 min baca'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 space-y-2.5">
                      
                      {/* Media Source & Relative Time */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-bold text-neutral-200 flex items-center gap-1.5 truncate max-w-[65%]">
                          <Newspaper className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{article.source}</span>
                          {article.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" title="Sumber Terverifikasi" />
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono shrink-0">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{formatRelativeTime(article.publishedAt)}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => {
                          setActiveReaderArticle(article);
                          setIsReaderOpen(true);
                        }}
                        className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 cursor-pointer"
                      >
                        {article.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {article.description}
                      </p>

                      {/* Hashtags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {article.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-mono text-neutral-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveReaderArticle(article);
                        setIsReaderOpen(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-neutral-800/90 hover:bg-emerald-500 hover:text-black text-neutral-200 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 shadow group/btn"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Baca Mode AI</span>
                    </button>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                      title="Buka Sumber Asli"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>

      {/* Interactive Reader Modal */}
      <NewsReaderModal
        article={activeReaderArticle}
        isOpen={isReaderOpen}
        onClose={() => {
          setIsReaderOpen(false);
          setActiveReaderArticle(null);
        }}
        isBookmarked={activeReaderArticle ? bookmarkedArticles.some(b => b.id === activeReaderArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onOpenReportModalWithContext={onOpenReportModalWithContext}
        showToast={showToast}
      />

    </div>
  );
}
