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
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/mockReports';

const SAMPLE_PHOTOS = [
  { label: 'Jalan Rusak', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sampah Menumpuk', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lampu Mati', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Banjir Selokan', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80' },
];

export default function CreateReportModal({ isOpen, onClose, onSubmitReport, openAlert }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Jalan Rusak');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Malang');
  const [coordinates, setCoordinates] = useState({ lat: -7.9503, lng: 112.6150 }); // Default Lowokwaru / Malang center
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Initialize and update interactive Mini-Map inside modal
  useEffect(() => {
    if (!isOpen || !miniMapRef.current) return;

    // Initialize mini Leaflet map
    if (!miniMapInstanceRef.current) {
      const map = L.map(miniMapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      // Create Draggable Marker Pin
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'draggable-mini-pin',
          html: `
            <div style="
              background-color: #10b981;
              color: #000000;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 17px;
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
              border: 3px solid #ffffff;
              cursor: grab;
            ">📍</div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      }).addTo(map);

      // Handle Pin Drag End
      marker.on('dragend', async () => {
        const { lat, lng } = marker.getLatLng();
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address || {};
            const cityFound = addr.city || addr.town || addr.regency || addr.state || 'Malang';
            setLocation(`${data.display_name} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
            setCity(cityFound);
          } else {
            setLocation(`Titik GPS Pilihan: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
          }
        } catch (err) {
          setLocation(`Titik GPS Pilihan: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
        }
      });

      // Handle Click anywhere on mini-map to drop pin
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address || {};
            const cityFound = addr.city || addr.town || addr.regency || addr.state || 'Malang';
            setLocation(`${data.display_name} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
            setCity(cityFound);
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
    const cityFound = addr.city || addr.town || addr.regency || addr.state || 'Malang';

    setCoordinates({ lat, lng });
    setCity(cityFound);
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
          const userCity = data.city || data.region || 'Malang';
          setCoordinates({ lat, lng });
          setCity(userCity);
          setLocation(`Area ${userCity}, ${data.region || 'Indonesia'} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
          return true;
        }
      }
    } catch (err) {
      console.warn('IP Geolocation fallback warning:', err);
    }
    return false;
  };

  // High-Precision Hardware GPS Handler
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
                const cityFound = addr.city || addr.town || addr.regency || addr.state || 'Malang';

                let formattedAddress = data.display_name;
                if (road || suburb) {
                  formattedAddress = [road, suburb, district, cityFound].filter(Boolean).join(', ');
                }

                setLocation(`${formattedAddress} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
                setCity(cityFound);
              } else {
                setLocation(`Titik GPS Real: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
              }
            } catch (err) {
              setLocation(`Titik GPS Real: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} (GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)})`);
            }
            resolve(true);
          },
          (err) => {
            console.warn('High accuracy hardware GPS timed out or unavailable, trying IP fallback:', err);
            resolve(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      });
    };

    (async () => {
      const browserSuccess = await tryHighPrecisionBrowserGPS();
      if (!browserSuccess) {
        const ipSuccess = await fetchIPLocationFallback();
        if (!ipSuccess) {
          setLocation('Lowokwaru, Malang, Jawa Timur (GPS: -7.950300, 112.615000)');
          setCity('Malang');
          setCoordinates({ lat: -7.9503, lng: 112.6150 });
        }
      }
      setIsLocating(false);
    })();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) {
      if (openAlert) {
        openAlert({ title: 'Form Belum Lengkap', message: 'Mohon lengkapi Judul Laporan, Lokasi, dan Deskripsi Detail Kendala.', type: 'warning' });
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Format location to persist GPS coordinates reliably in PostgreSQL
      const formattedLocation = location.includes('GPS:')
        ? location
        : `${location} (GPS: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)})`;

      // Extract accurate lat and lng from formattedLocation
      let finalCoords = coordinates;
      if (formattedLocation.includes('GPS:')) {
        const match = formattedLocation.match(/GPS:\s*([-\d.]+),\s*([-\d.]+)/);
        if (match) {
          finalCoords = { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
        }
      }

      const newReportData = {
        title,
        category,
        location: formattedLocation,
        city,
        coordinates: finalCoords,
        description,
        author: isAnonymous ? 'Warga Anonim' : (author.trim() || 'Warga Peduli'),
        isAnonymous,
        image: imageUrl || SAMPLE_PHOTOS[0].url,
        imageUrl: imageUrl || SAMPLE_PHOTOS[0].url,
      };

      onSubmitReport(newReportData);
      setIsSubmitting(false);
      onClose();

      setTitle('');
      setLocation('');
      setDescription('');
      setAuthor('');
      setIsAnonymous(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-black text-neutral-900 dark:text-white">Buat Laporan Fasilitas Baru</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Partisipasi warga untuk SDG 11 Kota Berkelanjutan</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {/* Judul Laporan */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Judul Laporan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lubang Jalan Rusak di Lowokwaru Malang..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Kategori & Kota */}
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
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Malang">Malang</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Semarang">Semarang</option>
                <option value="Medan">Medan</option>
                <option value="Badung / Bali">Badung / Bali</option>
              </select>
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
              <div ref={miniMapRef} className="w-full h-full min-h-[176px]" />
            </div>
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Bukti Foto Kendala Fasilitas
            </label>

            <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-center bg-neutral-50 dark:bg-neutral-900">
              {imageUrl ? (
                <div className="relative h-32 w-full rounded overflow-hidden group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="px-3 py-1 bg-emerald-500 text-black text-[11px] font-bold rounded cursor-pointer">
                      Ganti Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block py-3 space-y-1">
                  <Upload className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-bold">Klik untuk unggah foto</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] text-neutral-400 shrink-0 font-medium">Sampel foto:</span>
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(sample.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border font-bold whitespace-nowrap active:scale-95 transition-all ${
                    imageUrl === sample.url
                      ? 'bg-emerald-500 text-black border-emerald-500'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Deskripsi Detail Kendala *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan kondisi spesifik atau potensi bahaya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Privasi Anonim - Bulletproof Flex Toggle Switch */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Lapor sebagai Anonim
              </span>
              
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex items-center ${
                  isAnonymous ? 'bg-emerald-500 justify-end' : 'bg-neutral-300 dark:bg-neutral-700 justify-start'
                }`}
                title={isAnonymous ? 'Anonim Aktif' : 'Anonim Non-aktif'}
              >
                <span className="w-4 h-4 rounded-full bg-black dark:bg-white shadow-md transition-transform" />
              </button>
            </div>

            {!isAnonymous && (
              <input
                type="text"
                placeholder="Nama Lengkap Pelapor (opsional)..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold shadow flex items-center gap-1.5 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kirim Laporan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
