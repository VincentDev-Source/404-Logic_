// Vercel Serverless Function for Public Donation Statistics & Transparency
// Endpoint: GET /api/donate/history

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

  const now = new Date();
  const minutesAgo = (m) => new Date(now.getTime() - m * 60 * 1000).toISOString();

  // Public Donation Transparency Data
  const donationStats = {
    totalRaised: 87500000,
    targetGoal: 100000000,
    totalDonors: 348,
    currency: 'IDR',
    programs: [
      {
        id: 'prog-1',
        title: 'Mitigasi Banjir & Pompa Air Kota',
        target: 35000000,
        raised: 31500000,
        donors: 142,
        icon: 'Droplets',
        sdg: 'SDG 11.5',
      },
      {
        id: 'prog-2',
        title: 'Tanggap Darurat Bencana & Korban',
        target: 25000000,
        raised: 22800000,
        donors: 98,
        icon: 'ShieldAlert',
        sdg: 'SDG 11.5',
      },
      {
        id: 'prog-3',
        title: 'Perbaikan Jalan & Fasilitas Publik',
        target: 20000000,
        raised: 18200000,
        donors: 64,
        icon: 'Hammer',
        sdg: 'SDG 11.2',
      },
      {
        id: 'prog-4',
        title: 'Penanaman 10.000 Pohon & RTH',
        target: 10000000,
        raised: 8500000,
        donors: 29,
        icon: 'TreePine',
        sdg: 'SDG 11.7',
      },
      {
        id: 'prog-5',
        title: 'Pemasangan PJU Pintar Tenaga Surya',
        target: 10000000,
        raised: 6500000,
        donors: 15,
        icon: 'Lightbulb',
        sdg: 'SDG 11.6',
      },
    ],
    recentDonors: [
      {
        id: 'don-1',
        name: 'Hamba Allah (Warga Peduli)',
        amount: 250000,
        program: 'Mitigasi Banjir & Pompa Air Kota',
        message: 'Bismillah semoga banjir di kota lekas teratasi dan pompa air selalu prima.',
        createdAt: minutesAgo(12),
        verified: true,
      },
      {
        id: 'don-2',
        name: 'Komunitas Peduli Kota Malang',
        amount: 1000000,
        program: 'Perbaikan Jalan & Fasilitas Publik',
        message: 'Sedikit partisipasi untuk percepatan pengaspalan jalan rusak.',
        createdAt: minutesAgo(45),
        verified: true,
      },
      {
        id: 'don-3',
        name: 'dr. Hendra Prasetyo',
        amount: 500000,
        program: 'Tanggap Darurat Bencana & Korban',
        message: 'Semoga bantuan ini meringankan beban warga terdampak bencana.',
        createdAt: minutesAgo(120),
        verified: true,
      },
      {
        id: 'don-4',
        name: 'Siti Rahmawati',
        amount: 100000,
        program: 'Penanaman 10.000 Pohon & RTH',
        message: 'Untuk kota yang lebih asri, hijau, dan sejuk bagi anak cucu kita.',
        createdAt: minutesAgo(240),
        verified: true,
      },
      {
        id: 'don-5',
        name: 'PT Sinergi Karya Nusantara',
        amount: 5000000,
        program: 'Pemasangan PJU Pintar Tenaga Surya',
        message: 'Dukungan CSR untuk fasilitas penerangan umum jalan lingkungan.',
        createdAt: minutesAgo(360),
        verified: true,
      },
    ],
  };

  return res.status(200).json({
    success: true,
    data: donationStats,
  });
}
