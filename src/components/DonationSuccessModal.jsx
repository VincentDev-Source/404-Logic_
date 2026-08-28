import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { safeDecodeString } from '../utils/stringUtils';

export default function DonationSuccessModal({
  isOpen,
  onClose,
  donationDetails = {}
}) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#f59e0b']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#ec4899']
        });
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rawAmount = donationDetails.amount || 100000;
  const rawProgram = donationDetails.program || 'Mitigasi Banjir & Pompa Air Kota';
  const rawDonor = donationDetails.donor || 'Warga Peduli';
  const sessionId = donationDetails.sessionId || 'DONASI-' + Date.now();

  const amount = rawAmount;
  const program = safeDecodeString(rawProgram) || 'Mitigasi Banjir & Pompa Air Kota';
  const donor = safeDecodeString(rawDonor) || 'Warga Peduli';

  const handleShare = () => {
    const text = encodeURIComponent(`Saya baru saja berpartisipasi dalam program donasi kota "${program}" melalui CivicPulse SDG 11. Mari bersama membangun kota yang lebih tangguh dan berkelanjutan!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#09090b] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-5 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Success Heart Badge */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Heart className="w-8 h-8 fill-emerald-400 animate-bounce" />
          </div>

          {/* Title & Thank You */}
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              PEMBAYARAN MIDTRANS BERHASIL
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Terima Kasih, {donor}! 🎉
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Kontribusi donasi Anda telah terverifikasi secara resmi untuk mendukung pembangunan dan mitigasi kota berkelanjutan (SDG 11).
            </p>
          </div>

          {/* Digital Receipt Card */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-left space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-white font-sans">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>CivicPulse SDG 11 Receipt</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">PAID (MIDTRANS)</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Nominal:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  Rp {parseInt(amount, 10).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Program:</span>
                <span className="font-bold text-white text-right truncate max-w-[65%]">{program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Donatur:</span>
                <span className="text-white">{donor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Waktu:</span>
                <span className="text-neutral-400">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-500">Ref ID:</span>
                <span className="text-neutral-500 truncate max-w-[50%]">{sessionId}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Partisipasi ke WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-colors"
            >
              Tutup & Kembali ke Beranda
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
