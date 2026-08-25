// Vercel Serverless Function to Generate Midtrans Snap Sandbox Token
// Endpoint: POST /api/donate/midtrans-token

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

  if (!serverKey) {
    return res.status(500).json({
      error: 'Midtrans Server Key belum terpasang pada environment variable.',
    });
  }

  try {
    const {
      amount,
      program = 'Mitigasi Banjir & Pompa Air Kota',
      donorName = 'Warga Peduli',
      donorEmail = '',
      message = '',
      isAnonymous = false,
    } = req.body || {};

    const numericAmount = parseInt(amount, 10);
    if (!numericAmount || numericAmount < 1000) {
      return res.status(400).json({
        error: 'Nominal donasi minimal adalah Rp 1.000.',
      });
    }

    const displayName = isAnonymous ? 'Hamba Allah (Anonim)' : (donorName.trim() || 'Warga Peduli');
    const orderId = `DONASI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: numericAmount,
      },
      item_details: [
        {
          id: 'CIVIC-SDG11-DONASI',
          price: numericAmount,
          quantity: 1,
          name: `Donasi: ${program.slice(0, 40)}`,
        },
      ],
      customer_details: {
        first_name: displayName,
        email: donorEmail && donorEmail.includes('@') ? donorEmail : 'donatur@civicpulse.id',
      },
      custom_field1: program,
      custom_field2: message.slice(0, 200),
      custom_field3: String(isAnonymous),
      credit_card: {
        secure: true,
      },
    };

    const midtransRes = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(snapPayload),
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok || !midtransData.token) {
      console.error('Midtrans Snap Error:', midtransData);
      return res.status(midtransRes.status || 500).json({
        error: midtransData.error_messages ? midtransData.error_messages.join(', ') : 'Gagal membuat sesi transaksi Midtrans.',
      });
    }

    return res.status(200).json({
      success: true,
      token: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      orderId,
    });
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses transaksi Midtrans.',
    });
  }
}
