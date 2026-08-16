import React, { useState } from 'react';
import { CreditCard, QrCode, Wallet, Lock, CheckCircle2, ShieldCheck, X, Sparkles, Loader2, Download, Copy, AlertCircle } from 'lucide-react';
import { createPaymentIntentMock, formatIDR, formatUSD } from '../services/stripeService';

export const StripePaymentModal = ({ isOpen, onClose, bookingDetails, onPaymentSuccess }) => {
  if (!isOpen || !bookingDetails) return null;

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD | QRIS | EWALLET
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState('NUSA TRANSIT TESTER');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Auto-fill official Stripe test card details
  const handleAutoFillStripeTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('123');
    setCardHolder('STRIPE TEST USER');
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call mock Stripe Payment Intent API
      const result = await createPaymentIntentMock(bookingDetails);

      if (result.success) {
        setReceiptData({
          ...result,
          bookingDetails,
          paymentMethod
        });
        setIsProcessing(false);
        setPaymentCompleted(true);

        // Notify parent application after 1.5 seconds
        setTimeout(() => {
          onPaymentSuccess(result);
        }, 1500);
      }
    } catch (err) {
      setIsProcessing(false);
      alert('Gagal memproses pembayaran Stripe. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-lg glass-panel p-6 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        {!paymentCompleted ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-emerald">Stripe Gateway Sandbox</span>
              <span className="badge badge-blue">Secure 256-Bit SSL</span>
            </div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Checkout Pembayaran NusaTransit</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Penyedia Layanan Pembayaran Resmi Terenkripsi Stripe Payments.
            </p>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Pembayaran Stripe Berhasil!</h2>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              Transaksi Terverifikasi • Struk Pembayaran Diterbitkan
            </p>
          </div>
        )}

        {/* Booking Summary Box */}
        {bookingDetails && !paymentCompleted && (
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white text-sm">
                {bookingDetails.service?.name || 'NusaRide'}
              </span>
              <span className="text-emerald-400 font-bold text-base">
                {formatIDR(bookingDetails.finalFare)}
              </span>
            </div>

            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Penjemputan:</span>
                <strong className="text-slate-100 truncate max-w-[200px]">{bookingDetails.pickup?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tujuan:</span>
                <strong className="text-slate-100 truncate max-w-[200px]">{bookingDetails.destination?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Setara (USD):</span>
                <strong className="text-slate-400">{formatUSD(bookingDetails.finalFare)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT FORM (Before completion) */}
        {!paymentCompleted ? (
          <form onSubmit={handlePayNow} className="space-y-4">
            
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CARD'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Kartu Kredit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'QRIS'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('EWALLET')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'EWALLET'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>E-Wallet</span>
              </button>
            </div>

            {/* Method 1: CARD FORM */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400">Rincian Kartu Stripe:</span>
                  <button
                    type="button"
                    onClick={handleAutoFillStripeTestCard}
                    className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-1 rounded border border-emerald-800 hover:bg-emerald-900"
                  >
                    ⚡ Auto-Fill Test Card
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nomor Kartu (Stripe Test: 4242...)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="input-custom text-xs font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Kadaluarsa (MM/YY)</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      className="input-custom text-xs font-mono"
                      placeholder="12/28"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                      className="input-custom text-xs font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama Pemegang Kartu</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    className="input-custom text-xs"
                    placeholder="Nama Sesuai Kartu"
                  />
                </div>
              </div>
            )}

            {/* Method 2: QRIS SCAN MOCK */}
            {paymentMethod === 'QRIS' && (
              <div className="text-center p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <div className="w-40 h-40 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border-2 border-emerald-500 shadow-lg">
                  {/* Mock QR Code Pattern */}
                  <div className="w-full h-full bg-slate-950 rounded p-2 flex flex-col items-center justify-center text-emerald-400 text-center">
                    <QrCode className="w-24 h-24 text-white" />
                    <span className="text-[9px] font-bold text-slate-300 mt-1">NusaTransit QRIS Stripe</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Scan kode QRIS menggunakan GoPay, OVO, DANA, BCA Mobile, atau Aplikasi Banking Indonesia Anda.
                </p>
              </div>
            )}

            {/* Method 3: E-WALLET MOCK */}
            {paymentMethod === 'EWALLET' && (
              <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-2">Pilih penyedia e-wallet Indonesia:</p>
                {['GoPay Indonesia', 'OVO Cash', 'DANA Wallet', 'ShopeePay'].map((ew) => (
                  <label key={ew} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-emerald-500">
                    <span className="text-xs font-bold text-white">{ew}</span>
                    <input type="radio" name="ewallet" defaultChecked={ew.includes('GoPay')} className="accent-emerald-500" />
                  </label>
                ))}
              </div>
            )}

            {/* Footer Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full btn-primary py-3.5 text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Enkripsi Stripe SSL...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Bayar Sekarang ({formatIDR(bookingDetails.finalFare)})</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* RECEIPT / SUCCESS CONFIRMATION */
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{receiptData?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu Pembayaran:</span>
                <span className="text-slate-200">{new Date().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Bayar:</span>
                <span className="text-slate-200 font-bold">Stripe Payments ({paymentMethod})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Layanan:</span>
                <span className="text-slate-200">{bookingDetails.service?.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                <span>Total Lunas:</span>
                <span className="text-emerald-400">{formatIDR(bookingDetails.finalFare)}</span>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Mengalihkan Anda secara otomatis ke pelacakan pengemudi live...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
