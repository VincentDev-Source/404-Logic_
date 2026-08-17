import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Image as ImageIcon,
  Check,
  Building2,
  Trash2,
  Zap,
  Droplets,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/mockReports';

// Preset sample photos for quick demo testing
const SAMPLE_PHOTOS = [
  { label: 'Jalan Rusak', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sampah Menumpuk', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lampu Mati', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Banjir Selokan', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80' },
];

export default function CreateReportModal({ isOpen, onClose, onSubmitReport }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Jalan Rusak');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Simulate GPS location detector
  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation('Jl. MH Thamrin No. 28, Jakarta Pusat (Dekat Bundaran HI)');
      setCity('Jakarta');
      setIsLocating(false);
    }, 1000);
  };

  // Custom File Upload Preview Simulation
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
      alert('Mohon lengkapi Judul, Lokasi, dan Deskripsi laporan.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const newReportData = {
        title,
        category,
        location,
        city,
        description,
        author: isAnonymous ? 'Warga Anonim' : (author.trim() || 'Warga Peduli'),
        isAnonymous,
        image: imageUrl || SAMPLE_PHOTOS[0].url,
      };

      onSubmitReport(newReportData);
      setIsSubmitting(false);
      onClose();

      // Reset form
      setTitle('');
      setLocation('');
      setDescription('');
      setAuthor('');
      setIsAnonymous(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Buat Laporan Fasilitas Publik Baru</h2>
              <p className="text-xs text-slate-400">Partisipasi langsung warga untuk SDG 11 Kota Berkelanjutan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Judul Laporan */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Judul Laporan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lubang Jalan Rusak Rawan Kecelakaan di depan Stasiun..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Kategori Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategori Fasilitas *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kota / Wilayah *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
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

          {/* Lokasi Alamat & Tombol GPS */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Lokasi / Titik Alamat Lengkap *
              </label>
              <button
                type="button"
                onClick={handleSimulateGPS}
                disabled={isLocating}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Mendeteksi GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3" />
                    <span>Gunakan Lokasi GPS Saya</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Jl. Sudirman No. 45, Kecamatan..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Photo Upload Drag-and-Drop & Sample Preset */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bukti Foto Kendala Fasilitas
            </label>

            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center bg-slate-950/60 transition-colors">
              {imageUrl ? (
                <div className="relative h-40 w-full rounded-xl overflow-hidden group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer">
                      Ganti Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block py-4 space-y-2">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">Klik atau tarik foto ke sini</p>
                  <p className="text-[11px] text-slate-500">Format PNG, JPG maks 5MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Quick Demo Sample Photos */}
            <div className="mt-2 flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[11px] text-slate-400 shrink-0">atau pilih foto sampel demo:</span>
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(sample.url)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold whitespace-nowrap transition-all ${
                    imageUrl === sample.url
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi Detail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsi Detail Kendala *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan kondisi spesifik, potensi bahaya, atau perkiraan lama kerusakan terjadi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Author Name & Anonymous Toggle */}
          <div className="glass-card p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Lapor sebagai Anonim (Privasi Terjaga)
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isAnonymous ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span className={`w-4 h-4 bg-slate-950 rounded-full absolute top-1 transition-transform ${
                  isAnonymous ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {!isAnonymous && (
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap Pelapor (opsional)..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menerbitkan Tiket...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Laporan Sekarang</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
