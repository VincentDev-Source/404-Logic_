import prisma from '../../src/lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reports = await prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(reports);
    } catch (err) {
      console.error('Operator GET reports error:', err);
      return res.status(500).json({ error: 'Gagal mengambil daftar laporan dari database' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, status, verifiedBy } = req.body || {};

      if (!id || !status) {
        return res.status(400).json({ error: 'ID laporan dan status baru wajib dikirimkan!' });
      }

      const numId = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);

      const updatedReport = await prisma.report.update({
        where: { id: numId },
        data: {
          status,
          verifiedBy: verifiedBy || 'Petugas Resmi',
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: `Status laporan #${updatedReport.id} telah diperbarui menjadi "${status}"`,
        report: updatedReport,
      });
    } catch (err) {
      console.error('Operator PATCH report error:', err);
      return res.status(500).json({ error: err.message || 'Gagal memperbarui status laporan' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
