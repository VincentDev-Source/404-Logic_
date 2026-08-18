import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Loader2
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
  const [city, setCity] = useState('Jakarta');
  const [coordinates, setCoordinates] = useState({ lat: -6.2088, lng: 106.8456 });
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Helper for IP-based Geolocation Fallback
  const fetchIPLocationFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          const lat = data.latitude;
          const lng = data.longitude;
          const userCity = data.city || data.region || 'Jakarta';
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

  // High-Precision Hardware GPS Handler (enableHighAccuracy: true, maximumAge: 0, zoom=18 street level)
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
              // High accuracy zoom=18 reverse geocoding for building/street level precision
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
              const data = await res.json();
              if (data && data.display_name) {
                const addr = data.address || {};
                const road = addr.road || addr.street || addr.pedestrian || '';
                const suburb = addr.suburb || addr.village || addr.neighbourhood || addr.hamlet || '';
                const district = addr.city_district || addr.district || addr.county || '';
                const cityFound = addr.city || addr.town || addr.regency || addr.state || 'Jakarta';

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
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
      });
    };

    (async () => {
      const browserSuccess = await tryHighPrecisionBrowserGPS();
      if (!browserSuccess) {
        const ipSuccess = await fetchIPLocationFallback();
        if (!ipSuccess) {
          setLocation('Jl. MH Thamrin No. 28, Jakarta Pusat (GPS: -6.208800, 106.845600)');
          setCity('Jakarta');
          setCoordinates({ lat: -6.2088, lng: 106.8456 });
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
              placeholder="Contoh: Lubang Jalan Rusak Rawan Kecelakaan..."
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
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Semarang">Semarang</option>
                <option value="Medan">Medan</option>
                <option value="Badung / Bali">Badung / Bali</option>
              </select>
            </div>
          </div>

          {/* Lokasi Alamat & Tombol Real GPS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-neutral-800 dark:text-neutral-200">
                Lokasi / Titik Alamat Lengkap *
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
                    <span>Mengunci GPS Hardware...</span>
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
                placeholder="Jl. Sudirman No. 45..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-emerald-500 font-medium"
              />
              <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
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
