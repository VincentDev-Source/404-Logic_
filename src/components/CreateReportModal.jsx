import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Loader2,
  Search,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/mockReports';
import { INDONESIAN_CITIES, normalizeCityName } from '../data/indonesianCities';

const SAMPLE_PHOTOS = [
  { label: 'Jalan Rusak', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sampah Menumpuk', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lampu Mati', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Banjir Selokan', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80' },
];

// Custom Searchable Dropdown UI Component for Cities across Indonesia
function CitySearchDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = INDONESIAN_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    c.province.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-between shadow-sm hover:border-emerald-500/50 transition-colors"
      >
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{value || 'Pilih Kota / Wilayah'}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Glassmorphism Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2 space-y-2">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kota/kabupaten di Indonesia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          </div>

          {/* City Options List */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
            {filteredCities.length > 0 ? (
              filteredCities.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(item.name);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    value === item.name
                      ? 'bg-emerald-500 text-black font-extrabold'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    value === item.name ? 'bg-black/20 text-black font-bold' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                  }`}>
                    {item.province}
                  </span>
                </button>
              ))
            ) : (
              /* Allow custom typed city fallback */
              <div className="p-3 text-center space-y-2">
                <p className="text-xs text-neutral-500">Wilayah "{searchQuery}" tidak ada di daftar baku.</p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchQuery.trim());
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow"
                >
                  Gunakan "{searchQuery.trim()}"
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default function CreateReportModal({ isOpen, onClose, onSubmitReport, openAlert, initialData = null }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Jalan Rusak');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Kota Malang');
  const [coordinates, setCoordinates] = useState({ lat: -7.9503, lng: 112.6150 }); // Default Lowokwaru / Malang center
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialData if provided (e.g. from News reader modal)
  useEffect(() => {
    if (initialData && isOpen) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.city) setCity(initialData.city);
    }
  }, [initialData, isOpen]);

  // Address search auto-complete states
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mini Map Refs
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const draggableMarkerRef = useRef(null);

  // Address search auto-complete handler
  useEffect(() => {
    if (!location.trim() || location.includes('GPS:')) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=id&addressdetails=1&limit=5`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (err) {
        console.warn('Address search error:', err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  // Leaflet Mini-Map Initialization
  useEffect(() => {
    if (!isOpen || !miniMapRef.current) return;

    if (!miniMapInstanceRef.current) {
      const customPinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; items-center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; background: rgba(16, 185, 129, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; background: #10b981; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; items-center; justify-content: center;">
              <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const map = L.map(miniMapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      // Handle marker drag event to update location & city automatically
      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        const lat = position.lat;
        const lng = position.lng;
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address || {};
            const cityFound = addr.city || addr.town || addr.regency || addr.municipality || addr.city_district || addr.county || addr.state_district || addr.state || 'Kota Malang';
            setLocation(`${data.display_name} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
            setCity(normalizeCityName(cityFound));
          } else {
            setLocation(`Titik GPS Pilihan: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
          }
        } catch (err) {
          setLocation(`Titik GPS Pilihan: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
        }
      });

      miniMapInstanceRef.current = map;
      draggableMarkerRef.current = marker;
    }

    // Update mini-map position if coordinates change
    const map = miniMapInstanceRef.current;
    const marker = draggableMarkerRef.current;
    if (map && marker) {
      map.setView([coordinates.lat, coordinates.lng], 16);
      marker.setLatLng([coordinates.lat, coordinates.lng]);
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

  }, [isOpen, coordinates]);

  if (!isOpen) return null;

  // Handle selecting address from auto-complete dropdown
  const handleSelectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const addr = item.address || {};
    const cityFound = addr.city || addr.town || addr.regency || addr.municipality || addr.city_district || addr.county || addr.state_district || addr.state || 'Kota Malang';

    setCoordinates({ lat, lng });
    setCity(normalizeCityName(cityFound));
    setLocation(`${item.display_name} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
    setShowSuggestions(false);
  };

  // Helper for IP-based Geolocation Fallback
  const fetchIPLocationFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          const lat = data.latitude;
          const lng = data.longitude;
          const userCity = data.city || data.region || 'Kota Malang';
          setCoordinates({ lat, lng });
          setCity(normalizeCityName(userCity));
          setLocation(`Area ${userCity}, ${data.region || 'Indonesia'} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
          return true;
        }
      }
    } catch (err) {
      console.warn('IP Geolocation fallback warning:', err);
    }
    return false;
  };

  // High-Precision Hardware GPS Handler with Automatic City Extractor
  const handleFetchRealGPS = () => {
    setIsLocating(true);

    const tryHighPrecisionBrowserGPS = () => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setCoordinates({ lat, lng });

            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
              const data = await res.json();
              if (data && data.display_name) {
                const addr = data.address || {};
                const road = addr.road || addr.street || addr.pedestrian || '';
                const suburb = addr.suburb || addr.village || addr.neighbourhood || addr.hamlet || '';
                const district = addr.city_district || addr.district || addr.county || '';
                const cityFound = addr.city || addr.town || addr.regency || addr.municipality || addr.state_district || addr.state || 'Kota Malang';

                let formattedAddress = data.display_name;
                if (road || suburb) {
                  formattedAddress = [road, suburb, district, cityFound].filter(Boolean).join(', ');
                }

                setLocation(`${formattedAddress} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
                setCity(normalizeCityName(cityFound));
              } else {
                setLocation(`Titik GPS Real: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
              }
            } catch (err) {
              setLocation(`Titik GPS Real: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
            }
            resolve(true);
          },
          async (error) => {
            console.warn('Browser Geolocation Hardware Warning:', error.message);
            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        );
      });
    };

    tryHighPrecisionBrowserGPS().then(async (success) => {
      if (!success) {
        const ipSuccess = await fetchIPLocationFallback();
        if (!ipSuccess && openAlert) {
          openAlert({
            title: 'Koneksi GPS Terbatas',
            message: 'Tidak dapat mengunci koordinat GPS satelit secara otomatis. Silakan tentukan lokasi pada kolom pencarian alamat.',
            type: 'warning',
          });
        }
      }
      setIsLocating(false);
    });
  };

  // Image File Upload Simulator
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      if (openAlert) openAlert({ title: 'Form Belum Lengkap', message: 'Masukkan Judul Aduan terlebih dahulu!', type: 'warning' });
      return;
    }

    if (!location.trim()) {
      if (openAlert) openAlert({ title: 'Form Belum Lengkap', message: 'Tentukan Alamat / Lokasi Aduan terlebih dahulu!', type: 'warning' });
      return;
    }

    if (!description.trim()) {
      if (openAlert) openAlert({ title: 'Form Belum Lengkap', message: 'Tuliskan Deskripsi Kerusakan / Masalah secara rinci!', type: 'warning' });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitReport({
        title: title.trim(),
        category,
        location: location.trim(),
        city,
        coordinates,
        description: description.trim(),
        author: isAnonymous ? 'Pelapor Anonim' : author.trim() || 'Warga Peduli',
        isAnonymous,
        imageUrl,
      });

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSubmitting(false);
      onClose();

      // Reset Form State
      setTitle('');
      setLocation('');
      setDescription('');
      setAuthor('');
      setIsAnonymous(false);
      setImageUrl(SAMPLE_PHOTOS[0].url);

    } catch (err) {
      console.error('Error submitting report modal:', err);
      setIsSubmitting(false);
      if (openAlert) openAlert({ title: 'Gagal Mengirim Aduan', message: err.message || 'Terjadi kesalahan sistem.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      
      {/* Modal Dialog with Fixed Height Flex Column for 100% Scrollability on Mobile & Desktop */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-black rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-1rem)] sm:max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
        
        {/* Sticky Modal Header (Never cut off, title always accessible!) */}
        <div className="sticky top-0 z-20 shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-sm shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">Buat Aduan Fasilitas Publik</h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Lapor masalah publik langsung ke dinas teknis terkait</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Form Body (Scroll up & down seamlessly) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 text-xs">
          
          {/* Judul Laporan */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Judul Aduan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lubang Jalan Parah di Dekat Pertigaan Lowokwaru"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Kategori & Kota Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Kategori Fasilitas *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              >
                {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Kota / Wilayah *
              </label>
              <CitySearchDropdown
                value={city}
                onChange={(newCity) => setCity(newCity)}
              />
            </div>
          </div>

          {/* Lokasi Alamat & Instant Search Auto-Complete */}
          <div className="relative space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-neutral-800 dark:text-neutral-200">
                Cari Alamat & Lokasi Presisi *
              </label>
              <button
                type="button"
                onClick={handleFetchRealGPS}
                disabled={isLocating}
                className="text-[11px] text-emerald-500 hover:underline font-bold flex items-center gap-1"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                    <span>Mengunci GPS Satelit...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3 text-emerald-500" />
                    <span>Deteksi Lokasi GPS Otomatis</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ketik alamat e.g. Lowokwaru, Malang, Jatimulyo, Jl. Soekarno Hatta..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                className="w-full pl-8 pr-8 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
              />
              <MapPin className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
              {isSearchingAddress && (
                <Loader2 className="w-3.5 h-3.5 text-neutral-400 animate-spin absolute right-2.5 top-2.5" />
              )}
            </div>

            {/* Auto-Complete Dropdown Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                {searchSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800/50 last:border-none text-xs transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                        {item.display_name}
                      </p>
                      <p className="text-[10px] text-emerald-500 font-mono font-semibold">
                        GPS: {parseFloat(item.lat).toFixed(6)}, {parseFloat(item.lon).toFixed(6)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Mini-Map with Draggable Pin */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                Pilih / Geser Pin di Mini-Map Presisi:
              </span>
              <span className="text-emerald-500 font-mono font-bold text-[10px]">
                Lat: {coordinates.lat.toFixed(5)}, Lng: {coordinates.lng.toFixed(5)}
              </span>
            </div>

            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-inner">
              <div ref={miniMapRef} className="w-full h-full z-10" />
            </div>
          </div>

          {/* Deskripsi Masalah */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Deskripsi Rinci Kerusakan / Masalah *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan secara singkat kronologi, dampak, dan kondisi kerusakan fasilitas publik tersebut..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Pengungah Foto Bukti */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Foto Bukti Kerusakan Lapangan
            </label>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="URL Foto atau pilih contoh foto di bawah..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />

                <label className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Unggah</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Sample Photo Selectors */}
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(sample.url)}
                    className={`relative h-14 rounded-lg overflow-hidden border transition-all ${
                      imageUrl === sample.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105'
                        : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-white text-center py-0.5 truncate px-1">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Identitas Pelapor & Mode Anonim dengan Switch Toggle Modern */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Nama Pelapor
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                placeholder={isAnonymous ? 'Pelapor Anonim' : 'Contoh: Ahmad Subagyo'}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50 font-medium"
              />
            </div>

            {/* Modern Animated Switch Toggle */}
            <div className="flex items-center justify-between sm:justify-start space-x-3 p-2 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                role="switch"
                aria-checked={isAnonymous}
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAnonymous ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAnonymous ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <label 
                onClick={() => setIsAnonymous(!isAnonymous)}
                className="text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer flex items-center gap-1.5"
              >
                <span>Pelapor Anonim</span>
                <span className="text-[10px] text-neutral-500 font-medium">(Privasi Terjaga)</span>
              </label>
            </div>
          </div>

          {/* Hidden Submit Button to support Enter key form submission */}
          <button type="submit" className="hidden" />

        </form>

        {/* Sticky Modal Actions Footer */}
        <div className="sticky bottom-0 z-20 shrink-0 px-5 py-4 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menerbitkan Laporan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kirim Laporan Resmi</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
