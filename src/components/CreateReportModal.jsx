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

  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation('Jl. MH Thamrin No. 28, Jakarta Pusat');
      setCity('Jakarta');
      setIsLocating(false);
    }, 800);
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
      alert('Mohon lengkapi Judul, Lokasi, dan Deskripsi laporan.');
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
        description,
        author: isAnonymous ? 'Warga Anonim' : (author.trim() || 'Warga Peduli'),
        isAnonymous,
        image: imageUrl || SAMPLE_PHOTOS[0].url,
      };

      onSubmitReport(newReportData);
      setIsSubmitting(false);
      onClose();

      setTitle('');
      setLocation('');
      setDescription('');
      setAuthor('');
      setIsAnonymous(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Buat Laporan Fasilitas Baru</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Partisipasi warga untuk SDG 11 Kota Berkelanjutan</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {/* Judul Laporan */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Laporan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lubang Jalan Rusak Rawan Kecelakaan..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Kategori & Kota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Fasilitas *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.filter(c => c.id !== 'semua').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kota / Wilayah *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
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
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Lokasi / Titik Alamat Lengkap *
              </label>
              <button
                type="button"
                onClick={handleSimulateGPS}
                disabled={isLocating}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Mendeteksi GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3 h-3" />
                    <span>Gunakan Lokasi GPS</span>
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
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bukti Foto Kendala Fasilitas
            </label>

            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3 text-center bg-slate-50 dark:bg-slate-950">
              {imageUrl ? (
                <div className="relative h-32 w-full rounded overflow-hidden group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded cursor-pointer">
                      Ganti Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block py-3 space-y-1">
                  <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">Klik untuk unggah foto</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] text-slate-400 shrink-0">Sampel foto:</span>
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(sample.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium whitespace-nowrap ${
                    imageUrl === sample.url
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Detail Kendala *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan kondisi spesifik atau potensi bahaya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Privasi Anonim */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Lapor sebagai Anonim
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  isAnonymous ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                  isAnonymous ? 'left-4.5' : 'left-0.75'
                }`} />
              </button>
            </div>

            {!isAnonymous && (
              <input
                type="text"
                placeholder="Nama Lengkap Pelapor (opsional)..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow flex items-center gap-1.5 transition-all"
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
