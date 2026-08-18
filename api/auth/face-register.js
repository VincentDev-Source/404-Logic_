import prisma from '../../src/lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, role = 'OPERATOR', faceDescriptor } = req.body || {};

    if (!name || !faceDescriptor) {
      return res.status(400).json({ error: 'Nama petugas dan data vektor wajah (faceDescriptor) wajib diisi!' });
    }

    const descriptorString = typeof faceDescriptor === 'string' 
      ? faceDescriptor 
      : JSON.stringify(faceDescriptor);

    const newOperator = await prisma.operator.create({
      data: {
        name: name.trim(),
        role: role || 'OPERATOR',
        faceDescriptor: descriptorString,
      },
    });

    return res.status(200).json({ 
      success: true, 
      message: `Petugas ${newOperator.name} berhasil didaftarkan!`,
      operator: {
        id: newOperator.id,
        name: newOperator.name,
        role: newOperator.role,
        createdAt: newOperator.createdAt,
      }
    });
  } catch (err) {
    console.error('Face register API error:', err);
    return res.status(500).json({ error: err.message || 'Gagal menyimpan data petugas operator ke database' });
  }
}
