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

  // Real Browser GPS Geolocation + OpenStreetMap Reverse Geocoding
  const handleFetchRealGPS = () => {
    if (!navigator.geolocation) {
      if (openAlert) {
        openAlert({ title: 'GPS Tidak Didukung', message: 'Browser Anda tidak mendukung fitur lokasi GPS.', type: 'error' });
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
            const cityFound = data.address?.city || data.address?.town || data.address?.regency || data.address?.county || data.address?.state || 'Jakarta';
            setCity(cityFound);
          } else {
            setLocation(`Titik GPS Real: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setLocation(`Titik GPS Real: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (openAlert) {
          openAlert({ title: 'Izin Lokasi Ditolak', message: 'Gagal mendeteksi lokasi GPS. Pastikan izin akses lokasi browser telah diberikan.', type: 'warning' });
        }
        setLocation('Jl. MH Thamrin No. 28, Jakarta Pusat');
        setCity('Jakarta');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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

      const newReportData = {
        title,
        category,
        location,
        city,
        coordinates,
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-6">
        
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
                    <span>Mendeteksi Real GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3 text-emerald-500" />
                    <span>Gunakan Real GPS Browser</span>
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
                  className={`text-[10px] px-2 py-0.5 rounded border font-bold whitespace-nowrap ${
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

          {/* Privasi Anonim */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Lapor sebagai Anonim
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  isAnonymous ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span className={`w-3.5 h-3.5 bg-black dark:bg-white rounded-full absolute top-0.75 transition-transform ${
                  isAnonymous ? 'left-4.5 bg-black' : 'left-0.75'
                }`} />
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
              className="px-4 py-2 rounded-lg font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow flex items-center gap-1.5 transition-all"
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
