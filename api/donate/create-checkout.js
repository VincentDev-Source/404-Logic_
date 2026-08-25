// Vercel Serverless Function for Stripe Checkout Session
// Endpoint: POST /api/donate/create-checkout

import Stripe from 'stripe';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripeKey =
    process.env.STRIPE_SECRET_KEY ||
    process.env.OTHER_STRIPE_SECRET_KEY ||
    process.env.VITE_STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return res.status(500).json({
      error: 'Konfigurasi Stripe API Key belum terpasang di environment variable.',
    });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-06-20',
  });

  try {
    const {
      amount,
      program = 'Mitigasi Banjir & Pompa Air Kota',
      donorName = 'Warga Peduli',
      donorEmail = '',
      message = '',
      isAnonymous = false,
      originUrl,
    } = req.body || {};

    const numericAmount = parseInt(amount, 10);
    if (!numericAmount || numericAmount < 10000) {
      return res.status(400).json({
        error: 'Nominal donasi minimal adalah Rp 10.000.',
      });
    }

    // Determine host origin for success/cancel redirects
    const host = originUrl || req.headers.referer || req.headers.origin || 'https://404-logic.vercel.app';
    const baseUrl = host.replace(/\/$/, '');

    const displayName = isAnonymous ? 'Hamba Allah (Anonim)' : donorName;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'idr',
            unit_amount: numericAmount,
            product_data: {
              name: `Donasi Kota: ${program}`,
              description: `Partisipasi Publik CivicPulse SDG 11 - Donatur: ${displayName}`,
              images: [
                'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
              ],
            },
          },
          quantity: 1,
        },
      ],
      customer_email: donorEmail && donorEmail.includes('@') ? donorEmail : undefined,
      metadata: {
        donorName: displayName,
        program: program,
        message: message || '',
        isAnonymous: String(isAnonymous),
        amount: String(numericAmount),
      },
      success_url: `${baseUrl}/?donation=success&session_id={CHECKOUT_SESSION_ID}&amount=${numericAmount}&program=${encodeURIComponent(
        program
      )}&donor=${encodeURIComponent(displayName)}`,
      cancel_url: `${baseUrl}/?donation=cancelled`,
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses sesi pembayaran Stripe.',
    });
  }
}
