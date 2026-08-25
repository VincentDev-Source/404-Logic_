import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  X,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Droplets,
  ShieldAlert,
  Hammer,
  TreePine,
  Lightbulb,
  CheckCircle2,
  Users,
  TrendingUp,
  MessageSquare,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

const BASE_PROGRAMS = [
  {
    id: 'Mitigasi Banjir & Pompa Air Kota',
    title: 'Mitigasi Banjir & Pompa Air Kota',
    desc: 'Pengadaan pompa air cadangan dan normalisasi saluran primer titik rawan genangan.',
    icon: Droplets,
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-cyan-400',
    sdg: 'SDG 11.5',
    target: 'Rp 35.000.000',
  },
  {
    id: 'Tanggap Darurat Bencana & Korban',
    title: 'Tanggap Darurat Bencana & Korban',
    desc: 'Bantuan logistik darurat, posko evakuasi, dan obat-obatan bagi warga terdampak bencana.',
    icon: ShieldAlert,
    color: 'from-rose-500/20 to-amber-500/20 border-rose-500/40 text-rose-400',
    sdg: 'SDG 11.5',
    target: 'Rp 25.000.000',
  },
  {
    id: 'Perbaikan Jalan & Fasilitas Publik',
    title: 'Perbaikan Jalan & Fasilitas Publik',
    desc: 'Percepatan penambalan lubang jalan aspal, trotoar difabel, dan perbaikan jembatan.',
    icon: Hammer,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400',
    sdg: 'SDG 11.2',
    target: 'Rp 20.000.000',
  },
  {
    id: 'Penanaman 10.000 Pohon & RTH',
    title: 'Penanaman 10.000 Pohon & RTH',
    desc: 'Perluasan ruang terbuka hijau publik, penanaman pohon peneduh, dan biopori.',
    icon: TreePine,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
    sdg: 'SDG 11.7',
    target: 'Rp 10.000.000',
  },
  {
    id: 'Pemasangan PJU Pintar Tenaga Surya',
    title: 'Pemasangan PJU Pintar Tenaga Surya',
    desc: 'Pemasangan lampu penerangan jalan umum LED hemat energi di jalur pemukiman gelap.',
    icon: Lightbulb,
    color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-400',
    sdg: 'SDG 11.6',
    target: 'Rp 10.000.000',
  }
];

const PRESET_AMOUNTS = [
  { value: 25000, label: 'Rp 25.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 250000, label: 'Rp 250.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' }
];

export default function DonationModal({ isOpen, onClose, showToast, onDonationSuccess }) {
  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'transparency'
  const [selectedProgram, setSelectedProgram] = useState(BASE_PROGRAMS[0].id);
  const [selectedAmount, setSelectedAmount] = useState(100000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transparency Data State (100% Real from PostgreSQL / Midtrans)
  const [transparencyData, setTransparencyData] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch real-time transparency history
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/donate/history');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setTransparencyData(json.data);
      }
    } catch (err) {
      console.warn('Failed to load donation history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  // Merge base programs with real-time donation metrics
  const dynamicPrograms = useMemo(() => {
    return BASE_PROGRAMS.map((prog) => {
      const live = transparencyData?.programs?.find(
        (p) => p.id === prog.id || p.title === prog.title
      );
      const raisedVal = live ? live.raised : 0;
      const pct = live ? live.percentage : 0;
      return {
        ...prog,
        raised: `Rp ${raisedVal.toLocaleString('id-ID')}`,
        percentage: pct,
      };
    });
  }, [transparencyData]);

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!effectiveAmount || effectiveAmount < 1000) {
      if (showToast) showToast('Nominal Kurang', 'Nominal donasi minimal adalah Rp 1.000.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/donate/midtrans-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: effectiveAmount,
          program: selectedProgram,
          donorName: donorName.trim() || 'Warga Peduli',
          donorEmail: donorEmail.trim(),
          message: message.trim(),
          isAnonymous: isAnonymous,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || 'Gagal membuat sesi transaksi Midtrans.');
      }

      const snapToken = data.token;
      const orderId = data.orderId;

      if (window.snap && typeof window.snap.pay === 'function') {
        window.snap.pay(snapToken, {
          onSuccess: async function (result) {
            console.log('Midtrans Payment Success:', result);
            setIsSubmitting(false);
            onClose();

            // Auto verify and record to PostgreSQL
            try {
              await fetch('/api/donate/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: result.order_id || orderId,
                  transactionId: result.transaction_id,
                  amount: effectiveAmount,
                  program: selectedProgram,
                  donorName: isAnonymous ? 'Hamba Allah (Anonim)' : (donorName.trim() || 'Warga Peduli'),
                  donorEmail: donorEmail.trim(),
                  message: message.trim(),
                  isAnonymous: isAnonymous,
                  paymentType: result.payment_type || 'Midtrans Sandbox',
                }),
              });
            } catch (err) {
              console.warn('Verify call error:', err);
            }

            if (onDonationSuccess) {
              onDonationSuccess({
                amount: effectiveAmount,
                program: selectedProgram,
                donor: isAnonymous ? 'Hamba Allah (Anonim)' : (donorName.trim() || 'Warga Peduli'),
                sessionId: result.order_id || orderId,
                paymentType: result.payment_type || 'Midtrans Sandbox',
              });
            }

            if (showToast) {
              showToast('Donasi Berhasil 🎉', `Terima kasih! Donasi Rp ${effectiveAmount.toLocaleString('id-ID')} telah diterima via Midtrans.`, 'success');
            }
          },
          onPending: function (result) {
            console.log('Midtrans Payment Pending:', result);
            setIsSubmitting(false);
            if (showToast) {
              showToast('Menunggu Pembayaran ⏳', `Silakan selesaikan pembayaran via ${result.payment_type || 'Virtual Account / QRIS'}.`, 'info');
            }
          },
          onError: function (result) {
            console.error('Midtrans Payment Error:', result);
            setIsSubmitting(false);
            if (showToast) {
              showToast('Pembayaran Dibatalkan / Gagal', result.status_message || 'Transaksi tidak selesai.', 'error');
            }
          },
          onClose: function () {
            setIsSubmitting(false);
          },
        });
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('Midtrans Snap SDK belum termuat.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      if (showToast) showToast('Gagal Memproses Pembayaran', err.message, 'error');
      setIsSubmitting(false);
    }
  };

  const totalRaised = transparencyData?.totalRaised || 0;
  const targetGoal = transparencyData?.targetGoal || 100000000;
  const overallPercentage = targetGoal > 0 ? Math.min(100, Math.round((totalRaised / targetGoal) * 100)) : 0;
  const recentDonors = transparencyData?.recentDonors || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#09090b] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-200"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Donasi Pembangunan & Bencana Kota
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 hidden sm:inline-block">
                    MIDTRANS SANDBOX
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Partisipasi publik real-time untuk mendukung program prioritas pemerintah (SDG 11).
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-3 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('donate')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'donate'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Formulir Donasi</span>
            </button>
            <button
              onClick={() => setActiveTab('transparency')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'transparency'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Transparansi Dana Publik (Real Data)</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1 custom-scrollbar">
            
            {activeTab === 'donate' ? (
              <form onSubmit={handleCheckout} className="space-y-6">
                
                {/* 1. Select Program */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>1. Pilih Program Prioritas Kota</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Tersalurkan ke dinas terkait</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dynamicPrograms.map((prog) => {
                      const Icon = prog.icon;
                      const isSelected = selectedProgram === prog.id;

                      return (
                        <div
                          key={prog.id}
                          onClick={() => setSelectedProgram(prog.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-neutral-900 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                              : 'bg-neutral-950/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl border shrink-0 bg-gradient-to-br ${prog.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-white truncate">{prog.title}</h4>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                                  {prog.sdg}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                                {prog.desc}
                              </p>
                              {/* Progress bar */}
                              <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                                <span>Terkumpul: {prog.raised}</span>
                                <span className="font-bold text-emerald-400">{prog.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Select Amount */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>2. Nominal Donasi</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Bebas biaya admin</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_AMOUNTS.map((amt) => {
                      const isSelected = selectedAmount === amt.value && !customAmount;
                      return (
                        <button
                          key={amt.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt.value);
                            setCustomAmount('');
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-black border transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-black border-emerald-400 shadow-md scale-[1.03]'
                              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          {amt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-extrabold text-neutral-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Atau masukkan nominal kustom lainnya (Min. 10.000)..."
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 3. Donor Identity & Message */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-white">
                    3. Data Donatur & Doa untuk Kota
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Lengkap / Instansi..."
                      value={donorName}
                      disabled={isAnonymous}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                    <input
                      type="email"
                      placeholder="Email (untuk bukti/tanda terima donasi)..."
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Pesan, doa, atau harapan Anda untuk pembangunan kota..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  />

                  {/* Anonymous Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-800 focus:ring-0 cursor-pointer"
                    />
                    <span>Sembunyikan nama saya (Donasi sebagai Hamba Allah / Anonim)</span>
                  </label>
                </div>

                {/* Summary & Stripe Checkout CTA */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Total Pembayaran Donasi:</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                      Rp {effectiveAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-800 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Diproses secara aman oleh Midtrans Sandbox</span>
                    </div>
                    <span className="font-mono">QRIS • BCA/Mandiri/BNI/BRI VA • GoPay</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || effectiveAmount < 1000}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-black font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xl shadow-emerald-500/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menghubungkan ke Midtrans Snap...</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjutkan Pembayaran via Midtrans</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              /* Transparency & Public Donors Tab (100% Real) */
              <div className="space-y-6">
                
                {/* Hero Aggregate Metric */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        TOTAL DANA PARTISIPASI PUBLIK TERKUMPUL
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                        Rp {totalRaised.toLocaleString('id-ID')}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-neutral-400">Target Kota</span>
                      <p className="text-sm font-bold text-neutral-300 font-mono">
                        Rp {targetGoal.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${overallPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>{overallPercentage}% Tercapai</span>
                    <span>{transparencyData?.totalDonors || 0} Total Donatur Warga</span>
                  </div>
                </div>

                {/* Program Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-white">Alokasi & Progres Program</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dynamicPrograms.map((prog) => (
                      <div key={prog.id} className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white truncate">{prog.title}</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400">{prog.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${prog.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                          <span>{prog.raised}</span>
                          <span>Target: {prog.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Donors List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Donatur Terbaru & Pesan Dukungan</span>
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-500">Transparansi Real-time</span>
                  </div>

                  {recentDonors.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl space-y-2.5">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Belum Ada Donasi Publik Tercatat</p>
                        <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                          Jadilah donatur pertama dari warga untuk mendukung pembangunan dan mitigasi kota tercinta!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('donate')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Heart className="w-3.5 h-3.5 fill-black" />
                        <span>Salurkan Donasi Pertama</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentDonors.map((don) => (
                        <div key={don.id} className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-white">
                              <span>{don.name}</span>
                              {don.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <span className="font-mono font-extrabold text-emerald-400 text-xs">
                              Rp {don.amount.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 italic">
                            "{don.message}"
                          </p>
                          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 pt-0.5">
                            <span>Program: {don.program}</span>
                            <span>Terverifikasi Midtrans Sandbox</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

