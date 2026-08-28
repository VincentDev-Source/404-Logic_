// Vercel Serverless Function for 100% Real-time Public Donation Statistics & Transparency
// Endpoint: GET /api/donate/history

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

function safeDecodeString(str) {
  if (!str || typeof str !== 'string') return '';
  let result = str;
  for (let i = 0; i < 3; i++) {
    if (result.includes('%')) {
      try {
        const decoded = decodeURIComponent(result);
        if (decoded === result) break;
        result = decoded;
      } catch {
        break;
      }
    } else {
      break;
    }
  }
  return result.replace(/%20/g, ' ').replace(/\+/g, ' ').trim();
}

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

  // Sort by date descending
  realDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Compute 100% Real Aggregation Statistics
  const totalRaised = realDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalDonors = realDonations.length;
  const targetGoal = 100000000; // Rp 100.000.000 Target Kota

  const programs = PROGRAM_TARGETS.map((pt) => {
    const matchingDonations = realDonations.filter((d) => {
      const decodedProg = safeDecodeString(d.program || '');
      return (
        decodedProg &&
        (decodedProg.toLowerCase().includes(pt.title.toLowerCase()) ||
          pt.title.toLowerCase().includes(decodedProg.toLowerCase()))
      );
    });

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

  const recentDonors = realDonations.slice(0, 20).map((d) => {
    const cleanDonor = safeDecodeString(d.donorName) || 'Warga Peduli';
    const cleanProgram = safeDecodeString(d.program) || 'Mitigasi Banjir & Pompa Air Kota';
    const cleanMessage = safeDecodeString(d.message) || 'Donasi untuk kemajuan dan mitigasi kota';
    return {
      id: d.id,
      name: d.isAnonymous ? 'Hamba Allah (Anonim)' : cleanDonor,
      amount: Number(d.amount),
      program: cleanProgram,
      message: cleanMessage,
      createdAt: d.createdAt,
      verified: true,
    };
  });

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
