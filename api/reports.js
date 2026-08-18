import prisma from '../src/lib/prisma.js';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const reports = await prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      return res.status(500).json({ error: 'Gagal mengambil data laporan dari database.', details: error.message });
    }
  }

  if (method === 'POST') {
    try {
      const body = req.body || {};
      const { title, category, description, location, imageUrl, status } = body;

      if (!title || !category || !description) {
        return res.status(400).json({ error: 'Judul, kategori, dan deskripsi wajib diisi.' });
      }

      const newReport = await prisma.report.create({
        data: {
          title: String(title),
          category: String(category),
          description: String(description),
          location: location ? String(location) : null,
          imageUrl: imageUrl ? String(imageUrl) : null,
          status: status ? String(status) : 'Menunggu',
        },
      });

      return res.status(201).json(newReport);
    } catch (error) {
      console.error('Error creating report:', error);
      return res.status(500).json({ error: 'Gagal membuat laporan baru di database.', details: error.message });
    }
  }

  if (method === 'PATCH' || method === 'PUT') {
    try {
      const body = req.body || {};
      const { id, action, upvotes, status, rating, ratingFeedback } = body;

      if (!id) {
        return res.status(400).json({ error: 'ID laporan wajib disertakan.' });
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'ID laporan tidak valid.' });
      }

      let updatedReport;

      if (action === 'upvote') {
        updatedReport = await prisma.report.update({
          where: { id: numericId },
          data: { upvotes: { increment: 1 } },
        });
      } else if (action === 'downvote') {
        updatedReport = await prisma.report.update({
          where: { id: numericId },
          data: { upvotes: { decrement: 1 } },
        });
      } else if (action === 'rate' || rating !== undefined) {
        const ratingVal = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
        updatedReport = await prisma.report.update({
          where: { id: numericId },
          data: { 
            rating: ratingVal,
            ratingFeedback: ratingFeedback ? String(ratingFeedback) : null,
          },
        });
      } else if (upvotes !== undefined) {
        updatedReport = await prisma.report.update({
          where: { id: numericId },
          data: { upvotes: Number(upvotes) },
        });
      } else if (status !== undefined) {
        updatedReport = await prisma.report.update({
          where: { id: numericId },
          data: { status: String(status) },
        });
      } else {
        return res.status(400).json({ error: 'Tidak ada field update yang valid.' });
      }

      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
      return res.status(500).json({ error: 'Gagal memperbarui laporan di database.', details: error.message });
    }
  }

  if (method === 'DELETE') {
    try {
      const targetId = req.query?.id || req.body?.id;
      if (!targetId) {
        return res.status(400).json({ error: 'ID laporan wajib disertakan untuk penghapusan.' });
      }

      const numericId = parseInt(targetId, 10);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'ID laporan tidak valid.' });
      }

      await prisma.report.delete({
        where: { id: numericId },
      });

      return res.status(200).json({ success: true, message: 'Laporan berhasil dihapus dari database.' });
    } catch (error) {
      console.error('Error deleting report:', error);
      return res.status(500).json({ error: 'Gagal menghapus laporan dari database.', details: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Metode ${method} tidak diizinkan.` });
}
