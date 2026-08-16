import { loadStripe } from '@stripe/stripe-js';

// Ganti nilai VITE_STRIPE_PUBLIC_KEY di .env dengan Stripe Publishable Key asli Anda
// Contoh: pk_test_51...
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_sample_51NusaTransitGateway000000000000';

let stripePromise = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatUSD = (amountInIDR) => {
  const usdRate = 15800; // Est. 1 USD = 15,800 IDR
  const usdAmount = amountInIDR / usdRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(usdAmount);
};

// Simulasi pembuatan Stripe PaymentIntent backend
export const createPaymentIntentMock = async (bookingDetails) => {
  // Simulasikan latency jaringan backend 600ms
  await new Promise((resolve) => setTimeout(resolve, 600));

  const amountIDR = bookingDetails.finalFare || 25000;
  const transactionId = `pi_nusa_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

  return {
    success: true,
    clientSecret: `${transactionId}_secret_${Math.random().toString(36).substring(2, 8)}`,
    transactionId,
    amountIDR,
    amountUSD: formatUSD(amountIDR),
    currency: 'idr',
    timestamp: new Date().toISOString(),
    status: 'requires_payment_method',
    environment: import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 'live_or_sandbox' : 'dummy_simulation'
  };
};
