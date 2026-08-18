import prisma from '../../src/lib/prisma.js';

// Helper function to calculate Euclidean distance between two 128-D vector arrays
function calculateEuclideanDistance(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scannedDescriptor } = req.body || {};

    if (!scannedDescriptor || !Array.isArray(scannedDescriptor)) {
      return res.status(400).json({ error: 'Vektor pemindaian wajah (scannedDescriptor) wajib dikirimkan!' });
    }

    // Fetch all registered operators from PostgreSQL
    const operators = await prisma.operator.findMany();

    if (!operators || operators.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Belum ada petugas terdaftar di database! Silakan daftarkan petugas baru terlebih dahulu.',
      });
    }

    let bestMatch = null;
    let minDistance = Infinity;

    // Loop through registered operators and find the closest match
    for (const op of operators) {
      try {
        const storedVec = typeof op.faceDescriptor === 'string'
          ? JSON.parse(op.faceDescriptor)
          : op.faceDescriptor;

        const distance = calculateEuclideanDistance(scannedDescriptor, storedVec);

        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = op;
        }
      } catch (e) {
        console.warn(`Error parsing face descriptor for operator #${op.id}:`, e);
      }
    }

    // Threshold check (distance < 0.5 = MATCH SUCCESS)
    if (bestMatch && minDistance < 0.5) {
      return res.status(200).json({
        success: true,
        message: `Akses Diterima! Selamat datang, ${bestMatch.name}.`,
        operator: {
          id: bestMatch.id,
          name: bestMatch.name,
          role: bestMatch.role,
        },
        distance: parseFloat(minDistance.toFixed(4)),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Akses Ditolak! Wajah tidak cocok atau belum terdaftar sebagai operator resmi.',
        minDistance: minDistance === Infinity ? null : parseFloat(minDistance.toFixed(4)),
      });
    }
  } catch (err) {
    console.error('Face login API error:', err);
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan sistem saat memverifikasi wajah' });
  }
}
