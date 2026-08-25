// Vercel Serverless Function to Handle Midtrans Webhook Notifications
// Endpoint: POST /api/donate/midtrans-notification

import crypto from 'crypto';
import prisma from '../../src/lib/prisma.js';

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

  const serverKey =
    process.env.MIDTRANS_SERVER_KEY ||
    process.env.OTHER_MIDTRANS_SERVER_KEY ||
    '';

  try {
    const notification = req.body || {};
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      custom_field1,
      custom_field2,
      custom_field3,
    } = notification;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return res.status(400).json({ error: 'Data notifikasi tidak lengkap.' });
    }

    // Verify SHA512 signature hash
    if (serverKey) {
      const stringToHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const mySignature = crypto
        .createHash('sha512')
        .update(stringToHash)
        .digest('hex');

      if (mySignature !== signature_key) {
        return res.status(403).json({ error: 'Invalid Signature Key' });
      }
    }

    const isSuccess =
      transaction_status === 'capture'
        ? fraud_status === 'accept'
        : transaction_status === 'settlement';

    const program = custom_field1 || 'Mitigasi Banjir & Pompa Air Kota';
    const message = custom_field2 || '';
    const isAnonymous = custom_field3 === 'true';
    const amountNum = parseFloat(gross_amount) || 0;

    if (isSuccess) {
      await prisma.donation.upsert({
        where: { stripeSessionId: order_id },
        update: {
          amount: amountNum,
          program,
          message,
          isAnonymous,
          status: 'SUCCESS',
        },
        create: {
          stripeSessionId: order_id,
          amount: amountNum,
          program,
          donorName: isAnonymous ? 'Hamba Allah (Anonim)' : 'Warga Peduli',
          message,
          isAnonymous,
          status: 'SUCCESS',
        },
      });
    }

    return res.status(200).json({ status: 'OK', message: 'Notification processed' });
  } catch (error) {
    console.error('Error processing Midtrans notification:', error);
    return res.status(500).json({ error: error.message });
  }
}
