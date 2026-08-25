// Vercel Serverless Function for 100% Real-time Public Donation Statistics & Transparency
// Endpoint: GET /api/donate/history

import Stripe from 'stripe';
import prisma from '../../src/lib/prisma.js';

const PROGRAM_TARGETS = [
  {
    id: 'prog-1',
    title: 'Mitigasi Banjir & Pompa Air Kota',
    target: 35000000,
    icon: 'Droplets',
    sdg: 'SDG 11.5',
  },
  {
    id: 'prog-2',
    title: 'Tanggap Darurat Bencana & Korban',
    target: 25000000,
    icon: 'ShieldAlert',
    sdg: 'SDG 11.5',
  },
  {
    id: 'prog-3',
    title: 'Perbaikan Jalan & Fasilitas Publik',
    target: 20000000,
    icon: 'Hammer',
    sdg: 'SDG 11.2',
  },
  {
    id: 'prog-4',
    title: 'Penanaman 10.000 Pohon & RTH',
    target: 10000000,
    icon: 'TreePine',
    sdg: 'SDG 11.7',
  },
  {
    id: 'prog-5',
    title: 'Pemasangan PJU Pintar Tenaga Surya',
    target: 10000000,
    icon: 'Lightbulb',
    sdg: 'SDG 11.6',
  },
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const stripeKey =
    process.env.STRIPE_SECRET_KEY ||
    process.env.OTHER_STRIPE_SECRET_KEY ||
    process.env.VITE_STRIPE_SECRET_KEY;

  let realDonations = [];

  // 1. Fetch Real Donations from PostgreSQL Database
  try {
    const dbDonations = await prisma.donation.findMany({
      where: { status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
    });
    if (Array.isArray(dbDonations)) {
      realDonations = [...dbDonations];
    }
  } catch (dbErr) {
    console.warn('Database donation fetch warning:', dbErr.message);
  }

  // 2. Fetch Live Completed Sessions from Stripe Sandbox / Test Account to ensure immediate reflection
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
      const sessions = await stripe.checkout.sessions.list({ limit: 50 });

      if (sessions && Array.isArray(sessions.data)) {
        for (const session of sessions.data) {
          if (session.payment_status === 'paid' || session.status === 'complete') {
            const existsInDb = realDonations.some(
              (d) => d.stripeSessionId === session.id
            );

            if (!existsInDb && session.amount_total) {
              const meta = session.metadata || {};
              const donorName = meta.isAnonymous === 'true'
                ? 'Hamba Allah (Anonim)'
                : meta.donorName || session.customer_details?.name || 'Warga Peduli';
              const program = meta.program || 'Mitigasi Banjir & Pompa Air Kota';
              const message = meta.message || '';
              const isAnon = meta.isAnonymous === 'true';

              const newDonation = {
                id: `stripe-${session.id.slice(-6)}`,
                donorName,
                donorEmail: session.customer_details?.email || null,
                amount: session.amount_total,
                currency: session.currency ? session.currency.toUpperCase() : 'IDR',
                program,
                message,
                isAnonymous: isAnon,
                stripeSessionId: session.id,
                status: 'SUCCESS',
                createdAt: new Date(session.created * 1000),
              };

              realDonations.push(newDonation);

              // Auto-sync into PostgreSQL
              try {
                await prisma.donation.create({
                  data: {
                    stripeSessionId: session.id,
                    amount: session.amount_total,
                    program,
                    donorName,
                    donorEmail: session.customer_details?.email || null,
                    message,
                    isAnonymous: isAnon,
                    status: 'SUCCESS',
                    createdAt: new Date(session.created * 1000),
                  },
                });
              } catch (e) {
                // Ignore unique constraint collision
              }
            }
          }
        }
      }
    } catch (stripeErr) {
      console.warn('Stripe sessions query warning:', stripeErr.message);
    }
  }

  // Sort by date descending
  realDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Compute 100% Real Aggregation Statistics
  const totalRaised = realDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalDonors = realDonations.length;
  const targetGoal = 100000000; // Rp 100.000.000 Target Kota

  const programs = PROGRAM_TARGETS.map((pt) => {
    const matchingDonations = realDonations.filter(
      (d) =>
        d.program &&
        (d.program.toLowerCase().includes(pt.title.toLowerCase()) ||
          pt.title.toLowerCase().includes(d.program.toLowerCase()))
    );

    const raised = matchingDonations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0
    );
    const donors = matchingDonations.length;
    const percentage = pt.target > 0 ? Math.min(100, Math.round((raised / pt.target) * 100)) : 0;

    return {
      id: pt.id,
      title: pt.title,
      target: pt.target,
      raised: raised,
      donors: donors,
      icon: pt.icon,
      sdg: pt.sdg,
      percentage: percentage,
    };
  });

  const recentDonors = realDonations.slice(0, 15).map((d) => ({
    id: d.id,
    name: d.isAnonymous ? 'Hamba Allah (Anonim)' : d.donorName,
    amount: Number(d.amount),
    program: d.program,
    message: d.message || 'Donasi untuk kota berkelanjutan',
    createdAt: d.createdAt,
    verified: true,
  }));

  return res.status(200).json({
    success: true,
    data: {
      totalRaised,
      targetGoal,
      totalDonors,
      currency: 'IDR',
      programs,
      recentDonors,
    },
  });
}
