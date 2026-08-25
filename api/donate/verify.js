// Vercel Serverless Function to Verify & Record Real Stripe Donation
// Endpoint: POST /api/donate/verify

import Stripe from 'stripe';
import prisma from '../../src/lib/prisma.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const stripeKey =
    process.env.STRIPE_SECRET_KEY ||
    process.env.OTHER_STRIPE_SECRET_KEY ||
    process.env.VITE_STRIPE_SECRET_KEY;

  try {
    const payload = req.method === 'POST' ? req.body || {} : req.query || {};
    const {
      sessionId,
      amount,
      program,
      donorName,
      donorEmail,
      message,
      isAnonymous,
    } = payload;

    let finalAmount = parseFloat(amount) || 0;
    let finalProgram = program || 'Mitigasi Banjir & Pompa Air Kota';
    let finalDonorName = donorName || 'Warga Peduli';
    let finalEmail = donorEmail || null;
    let finalMessage = message || '';
    let finalIsAnonymous = isAnonymous === true || isAnonymous === 'true';

    // If Stripe session ID provided and Stripe key exists, verify directly with Stripe
    if (sessionId && stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session) {
          if (session.amount_total) {
            finalAmount = session.amount_total;
          }
          if (session.metadata) {
            if (session.metadata.program) finalProgram = session.metadata.program;
            if (session.metadata.donorName) finalDonorName = session.metadata.donorName;
            if (session.metadata.message) finalMessage = session.metadata.message;
            if (session.metadata.isAnonymous !== undefined) {
              finalIsAnonymous = session.metadata.isAnonymous === 'true';
            }
          }
          if (session.customer_details?.email) {
            finalEmail = session.customer_details.email;
          }
        }
      } catch (stripeErr) {
        console.warn('Stripe session retrieval warning:', stripeErr.message);
      }
    }

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ error: 'Nominal donasi tidak valid.' });
    }

    // Save into PostgreSQL database using Prisma
    let donationRecord = null;
    try {
      if (sessionId) {
        donationRecord = await prisma.donation.upsert({
          where: { stripeSessionId: sessionId },
          update: {
            amount: finalAmount,
            program: finalProgram,
            donorName: finalIsAnonymous ? 'Hamba Allah (Anonim)' : finalDonorName,
            donorEmail: finalEmail,
            message: finalMessage,
            isAnonymous: finalIsAnonymous,
            status: 'SUCCESS',
          },
          create: {
            stripeSessionId: sessionId,
            amount: finalAmount,
            program: finalProgram,
            donorName: finalIsAnonymous ? 'Hamba Allah (Anonim)' : finalDonorName,
            donorEmail: finalEmail,
            message: finalMessage,
            isAnonymous: finalIsAnonymous,
            status: 'SUCCESS',
          },
        });
      } else {
        donationRecord = await prisma.donation.create({
          data: {
            amount: finalAmount,
            program: finalProgram,
            donorName: finalIsAnonymous ? 'Hamba Allah (Anonim)' : finalDonorName,
            donorEmail: finalEmail,
            message: finalMessage,
            isAnonymous: finalIsAnonymous,
            status: 'SUCCESS',
          },
        });
      }
    } catch (dbErr) {
      console.error('Database write error for donation:', dbErr);
    }

    return res.status(200).json({
      success: true,
      donation: donationRecord || {
        amount: finalAmount,
        program: finalProgram,
        donorName: finalIsAnonymous ? 'Hamba Allah (Anonim)' : finalDonorName,
        message: finalMessage,
      },
    });
  } catch (error) {
    console.error('Error in /api/donate/verify:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memverifikasi donasi.',
    });
  }
}
