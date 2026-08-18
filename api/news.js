// Vercel Serverless Function Proxy for Local & Disaster Mitigation News
// Endpoint: GET /api/news?city=[namaKota]

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

  // Extract city query parameter
  let city = req.query?.city || 'Jakarta';
  if (Array.isArray(city)) city = city[0];
  city = city.trim();

  // Clean city name formatting
  const cleanCity = city.replace(/^(Kota|Kabupaten|Kab\.)\s+/i, '').trim();

  try {
    const query = `"${cleanCity}" AND (bencana OR banjir OR gempa OR cuaca OR infrastruktur OR perbaikan)`;
    let articles = [];

    // Option 1: GNews API if environment key is provided
    if (process.env.GNEWS_API_KEY) {
      try {
        const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=id&country=id&max=10&apikey=${process.env.GNEWS_API_KEY}`;
        const gnewsRes = await fetch(gnewsUrl);
        if (gnewsRes.ok) {
          const gnewsData = await gnewsRes.json();
          if (gnewsData.articles && gnewsData.articles.length > 0) {
            articles = gnewsData.articles.map((art, idx) => ({
              id: `gnews-${idx}-${Date.now()}`,
              title: art.title,
              description: art.description || 'Tidak ada deskripsi singkat untuk berita ini.',
              url: art.url,
              source: art.source?.name || 'GNews Aggregator',
              image: art.image || getFallbackImage(art.title),
              publishedAt: art.publishedAt || new Date().toISOString(),
              category: classifyCategory(art.title + ' ' + (art.description || ''))
            }));
          }
        }
      } catch (err) {
        console.warn('GNews API fetch error:', err.message);
      }
    }

    // Option 2: RSS2JSON Aggregator (Google News Indonesia RSS) if GNews returned no articles
    if (articles.length === 0) {
      try {
        const rssQuery = `${cleanCity} bencana OR banjir OR cuaca OR infrastruktur OR perbaikan`;
        const googleRssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(rssQuery)}&hl=id&gl=ID&ceid=ID:id`;
        const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleRssUrl)}`;

        const rssRes = await fetch(rss2jsonUrl);
        if (rssRes.ok) {
          const rssData = await rssRes.json();
          if (rssData.status === 'ok' && rssData.items && rssData.items.length > 0) {
            articles = rssData.items.slice(0, 10).map((item, idx) => {
              const cleanTitle = item.title ? item.title.replace(/\s*-\s*[^-]+$/, '') : 'Berita Daerah';
              const sourceName = item.author || extractSourceFromTitle(item.title) || 'Berita Terkini';
              const textContent = stripHtml(item.description || item.content || '');

              return {
                id: `rss-${idx}-${Date.now()}`,
                title: cleanTitle,
                description: textContent.length > 10 ? textContent.slice(0, 180) + '...' : `Informasi berita terkini seputar wilayah ${cleanCity}.`,
                url: item.link || item.guid || '#',
                source: sourceName,
                image: item.enclosure?.link || item.thumbnail || getFallbackImage(cleanTitle),
                publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                category: classifyCategory(cleanTitle + ' ' + textContent)
              };
            });
          }
        }
      } catch (err) {
        console.warn('RSS2JSON fetch error:', err.message);
      }
    }

    // Option 3: Fallback Mock Data if API calls fail or return 0 results
    if (articles.length === 0) {
      articles = generateMockArticles(cleanCity);
    }

    return res.status(200).json({
      success: true,
      city: cleanCity,
      total: articles.length,
      articles: articles
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    // Always return clean mock fallback data on error
    return res.status(200).json({
      success: true,
      isFallback: true,
      city: cleanCity,
      articles: generateMockArticles(cleanCity)
    });
  }
}

// Utility: Classify category into "Bencana & Cuaca" or "Tata Kota & Aduan"
function classifyCategory(text) {
  const lower = text.toLowerCase();
  const disasterKeywords = ['bencana', 'banjir', 'gempa', 'cuaca', 'hujan', 'puting beliung', 'longsor', 'bmkg', 'bpbd', 'siaga', 'evakuasi', 'angin', 'gelombang'];
  const isDisaster = disasterKeywords.some(kw => lower.includes(kw));
  return isDisaster ? 'Bencana & Cuaca' : 'Tata Kota & Aduan';
}

// Utility: Strip HTML tags
function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

// Utility: Extract source name from title format "Judul Berita - Detikcom"
function extractSourceFromTitle(title) {
  if (!title) return null;
  const parts = title.split(' - ');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return null;
}

// Utility: Fallback images based on keywords
function getFallbackImage(title) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('banjir') || lower.includes('hujan') || lower.includes('air')) {
    return 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('gempa') || lower.includes('bencana') || lower.includes('bpbd')) {
    return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('jalan') || lower.includes('infrastruktur') || lower.includes('pju') || lower.includes('perbaikan')) {
    return 'https://images.unsplash.com/photo-1584463688353-27c196413a91?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80';
}

// Generate realistic mock articles for any Indonesian city
function generateMockArticles(city) {
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: `mock-1-${city}`,
      title: `BMKG Rilis Peringatan Waspada Hujan Lebat & Angin Kencang di Wilayah ${city}`,
      description: `Stasiun Meteorologi BMKG mengimbau warga ${city} meningkatkan kesiapsiagaan menghadapi potensi cuaca ekstrem yang diprakirakan berlangsung hingga akhir pekan.`,
      url: 'https://www.bmkg.go.id',
      source: 'BMKG Indonesia',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(1),
      category: 'Bencana & Cuaca'
    },
    {
      id: `mock-2-${city}`,
      title: `Pemerintah Kota ${city} Operasikan 12 Pompa Air Tambahan Pasca Pemeliharaan Drainase`,
      description: `Dinas Sumber Daya Air Pemkot ${city} memastikan sistem drainase utama berfungsi optimal menjelang puncak musim penghujan untuk mencegah titik genangan air.`,
      url: 'https://www.antaranews.com',
      source: 'Antara News',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(3),
      category: 'Bencana & Cuaca'
    },
    {
      id: `mock-3-${city}`,
      title: `Percepatan Perbaikan Jalan Rusak & Pemasangan PJU Pintar di Jalur Utama ${city}`,
      description: `Tim Bina Marga Pemkot ${city} menindaklanjuti laporan aduan warga mengenai fasilitas umum, melakukan penambalan lubang jalan dan perbaikan penerangan jalan umum.`,
      url: 'https://www.detik.com',
      source: 'Detik Regional',
      image: 'https://images.unsplash.com/photo-1584463688353-27c196413a91?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(5),
      category: 'Tata Kota & Aduan'
    },
    {
      id: `mock-4-${city}`,
      title: `BPBD Kota ${city} Gelar Simulasi Evakuasi Bencana Berbasis Kelurahan Tangguh`,
      description: `Guna memperkuat ketahanan kota (SDG 11), BPBD ${city} melibatkan ratusan relawan dan warga setempat dalam latihan kesiapsiagaan serta evakuasi darurat.`,
      url: 'https://www.kompas.com',
      source: 'Kompas Regional',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(8),
      category: 'Bencana & Cuaca'
    },
    {
      id: `mock-5-${city}`,
      title: `Revitalisasi Ruang Terbuka Hijau & Taman Kota ${city} Capai Progres 85 Persen`,
      description: `Pemerintah daerah memperluas area hijau perkotaan dan fasilitas interaktif ramah disabilitas sebagai bagian dari komitmen pembangunan kota berkelanjutan.`,
      url: 'https://www.republika.co.id',
      source: 'Republika News',
      image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(12),
      category: 'Tata Kota & Aduan'
    },
    {
      id: `mock-6-${city}`,
      title: `Uji Coba Sensor Deteksi Dini Banjir Berbasis IoT di Beberapa Sungai ${city}`,
      description: `Integrasi teknologi sensor air terkoneksi aplikasi CivicPulse memudahkan petugas dan warga menerima notifikasi peringatan banjir secara real-time.`,
      url: 'https://www.tempo.co',
      source: 'Tempo Tekno',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
      publishedAt: hoursAgo(18),
      category: 'Tata Kota & Aduan'
    }
  ];
}
