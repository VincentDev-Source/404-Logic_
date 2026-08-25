// Fallback news generator for client-side resiliency with thematic thumbnail matching

export function getClientFallbackArticles(city = 'Jakarta') {
  const cleanCity = city.replace(/^(Kota|Kabupaten|Kab\.)\s+/i, '').trim() || 'Jakarta';
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: `fallback-1-${cleanCity}`,
      title: `Antisipasi Banjir di Musim Hujan, Pemkot ${cleanCity} Normalisasi Ratusan Titik Drainase`,
      description: `Pemerintah Kota ${cleanCity} mengerahkan tim terpadu untuk melakukan pengerukan sedimen dan pembersihan saluran air mikro di seluruh kawasan rawan genangan.`,
      fullContent: `Menjelang puncak musim hujan, Pemerintah Kota ${cleanCity} mengintensifkan program normalisasi ratusan saluran drainase perkotaan. Pengerukan endapan lumpur dan sampah liar dilakukan secara serentak melibatkan Dinas PUPR dan relawan masyarakat.\n\nLangkah ini terbukti efektif menurunkan titik genangan air secara signifikan dan mempercepat aliran debit air menuju sungai utama. Warga juga diimbau untuk tidak membuang sampah sembarangan ke selokan lingkungan.`,
      aiSummary: [
        `Pemkot ${cleanCity} melakukan normalisasi saluran drainase serentak di titik rawan.`,
        `Pengerukan sedimen dan pembersihan saringan pompa terus dikebut setiap hari.`,
        `Masyarakat diajak aktif bergotong-royong menjaga kebersihan saluran air lingkungan.`
      ],
      url: 'https://www.lentera.co',
      source: 'Lentera Regional',
      image: getThematicNewsImage(`Antisipasi Banjir di Musim Hujan Normalisasi Ratusan Drainase ${cleanCity}`, 'Bencana & Cuaca'),
      publishedAt: hoursAgo(1),
      category: 'Bencana & Cuaca',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#MitigasiBanjir', '#DrainaseKota', '#SDG11'],
      verified: true,
      views: 1420,
      sentiment: 'alert'
    },
    {
      id: `fallback-2-${cleanCity}`,
      title: `Pemkot ${cleanCity} Dorong Normalisasi Aliran Sungai Utama, Ajukan Usulan Ke BBWS`,
      description: `Pemerintah Daerah berkoordinasi intensif dengan Balai Besar Wilayah Sungai (BBWS) guna merealisasikan pengerukan dan perkuatan tanggul sungai.`,
      fullContent: `Dinas Pekerjaan Umum dan Penataan Ruang Kota ${cleanCity} mengajukan usulan strategis kepada Balai Besar Wilayah Sungai (BBWS) terkait percepatan normalisasi dan perkuatan tanggul sungai utama perkotaan.\n\nUpaya ini difokuskan pada pelebaran badan sungai yang mengalami penyempitan akibat sedimentasi dan erosi tebing. Diharapkan daya tampung aliran air dapat meningkat optimal sebelum intensitas hujan ekstrem tiba.`,
      aiSummary: [
        `Pemkot ${cleanCity} berkolaborasi dengan BBWS untuk normalisasi sungai utama.`,
        `Fokus pada pengerukan sedimentasi dasar sungai dan perkuatan tanggul penahan.`,
        `Meningkatkan kapasitas tampung air demi mencegah luapan ke permukiman.`
      ],
      url: 'https://www.memontum.com',
      source: 'Memontum News',
      image: getThematicNewsImage(`Normalisasi Sungai Amprong BBWS Pengerukan Aliran Air ${cleanCity}`, 'Tata Kota & Jalan'),
      publishedAt: hoursAgo(3),
      category: 'Tata Kota & Jalan',
      readTime: '3 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#NormalisasiSungai', '#BBWS', '#TataAir'],
      verified: true,
      views: 1180,
      sentiment: 'info'
    },
    {
      id: `fallback-3-${cleanCity}`,
      title: `Prakiraan Cuaca ${cleanCity} Hari Ini Cerah Berawan, Waspada Udara Kabur Dini Hari`,
      description: `BMKG memprakirakan kondisi cuaca didominasi cerah dengan potensi kabut tipis pada malam menjelang dini hari akibat penurunan suhu.`,
      fullContent: `Stasiun Meteorologi BMKG merilis prakiraan cuaca terkini untuk wilayah ${cleanCity} dan sekitarnya. Kondisi atmosfer terpantau relatif stabil dengan dominasi cuaca cerah berawan pada pagi hingga sore hari.\n\nNamun, masyarakat dihimbau mewaspadai potensi kabut tipis dan penurunan jarak pandang pada malam hingga dini hari akibat kelembapan udara yang tinggi. Pengendara jalan raya diminta menyalakan lampu kabut saat melintas di jalur perbukitan.`,
      aiSummary: [
        `Prakiraan cuaca ${cleanCity} didominasi cerah berawan di siang hari.`,
        `Potensi kabut tipis dan penurunan suhu terjadi pada malam hingga dini hari.`,
        `Pengendara dihimbau berhati-hati dan menjaga jarak aman kendaraan.`
      ],
      url: 'https://www.beritajatim.com',
      source: 'Beritajatim Media',
      image: getThematicNewsImage(`Cuaca Hari Ini Cerah Udara Kabur Langit ${cleanCity}`, 'Bencana & Cuaca'),
      publishedAt: hoursAgo(4),
      category: 'Bencana & Cuaca',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#PrakiraanCuaca', '#BMKG', '#SuhuUdara'],
      verified: true,
      views: 890,
      sentiment: 'positive'
    },
    {
      id: `fallback-4-${cleanCity}`,
      title: `Dinas Bina Marga ${cleanCity} Percepat Perbaikan Jalan Rusak & Pasang 500 Unit PJU Pintar`,
      description: `Pemerintah Kota mempercepat penambalan jalan aspal berlubang dan modernisasi lampu penerangan jalan umum berbasis LED pintar.`,
      fullContent: `Menindaklanjuti ratusan aduan masyarakat melalui portal CivicPulse, Dinas Bina Marga Kota ${cleanCity} menggelar operasi penambalan jalan aspal berlubang di sepanjang koridor arteri utama.\n\nSelain perbaikan jalan, program modernisasi Penerangan Jalan Umum (PJU) berbasis LED pintar juga resmi dipasang di 500 titik rawan kecelakaan. Sistem pencahayaan baru ini terintegrasi dengan sensor otomatis guna efisiensi energi dan keselamatan warga.`,
      aiSummary: [
        `Dinas Bina Marga mempercepat pengaspalan jalan rusak di jalur arteri ${cleanCity}.`,
        `Pemasangan 500 unit PJU pintar LED hemat energi terhubung ke pusat monitoring.`,
        `Tindakan ini merupakan respon langsung terhadap laporan aduan warga via CivicPulse.`
      ],
      url: 'https://www.detik.com',
      source: 'Dinas Bina Marga',
      image: getThematicNewsImage(`Perbaikan Jalan Rusak Aspal Lubang PJU Lampu ${cleanCity}`, 'Tata Kota & Jalan'),
      publishedAt: hoursAgo(6),
      category: 'Tata Kota & Jalan',
      readTime: '3 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#Infrastruktur', '#PJUSmart', '#AduanWarga'],
      verified: true,
      views: 980,
      sentiment: 'positive'
    },
    {
      id: `fallback-5-${cleanCity}`,
      title: `Pemkot ${cleanCity} Terapkan Sensor Ketinggian Air IoT Terhubung CivicPulse untuk Deteksi Banjir Cepat`,
      description: `Inovasi teknologi smart city diterapkan di pintu air sungai utama ${cleanCity} guna memberikan notifikasi dini otomatis ke ponsel warga.`,
      fullContent: `Pemerintah Kota ${cleanCity} resmi meluncurkan integrasi sensor ultrasonik pendeteksi ketinggian air sungai berbasis Internet of Things (IoT). Sensor ini dipasang di 8 titik pintu air vital dan jembatan sungai utama.\n\nData telemetri yang dikirimkan setiap 10 detik secara otomatis diolah oleh sistem CivicPulse untuk memetakan status siaga (Siaga 1-4). Jika ketinggian air melebihi batas aman, warga dalam radius 2 kilometer akan menerima notifikasi waspada langsung.`,
      aiSummary: [
        `Sensor IoT ultrasonik dipasang pada 8 titik pintu air vital di ${cleanCity}.`,
        `Data level air dipancarkan real-time setiap 10 detik ke peta interaktif.`,
        `Mendukung pencapaian target SDG 11.5 untuk kota tangguh bencana.`
      ],
      url: 'https://www.tempo.co',
      source: 'Diskominfo Smart City',
      image: getThematicNewsImage(`Sensor Ketinggian Air IoT Smart City Telemetri ${cleanCity}`, 'Inovasi & Smart City'),
      publishedAt: hoursAgo(8),
      category: 'Inovasi & Smart City',
      readTime: '3 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#SmartCity', '#SensorIoT', '#EarlyWarning'],
      verified: true,
      views: 850,
      sentiment: 'info'
    },
    {
      id: `fallback-6-${cleanCity}`,
      title: `Revitalisasi Ruang Terbuka Hijau & Fasilitas Ramah Disabilitas di Taman Kota ${cleanCity}`,
      description: `Kawasan taman kota dipercantik dengan jalur pedestrian bertekstur taktil, arena bermain inklusif, dan 1.000 lubang biopori.`,
      fullContent: `Pembangunan Ruang Terbuka Hijau (RTH) ramah inklusi di ${cleanCity} kini telah mencapai 90%. Proyek ini dirancang agar seluruh lapisan masyarakat, termasuk penyandang disabilitas dan lansia, dapat menikmati fasilitas publik dengan nyaman.\n\nSelain penataan lanskap taman, ditanam lebih dari 300 pohon peneduh serta dibuat 1.000 lubang biopori untuk konservasi air tanah dan pengurangan suhu udara perkotaan.`,
      aiSummary: [
        `Penyelesaian revitalisasi taman kota inklusif di ${cleanCity} mencapai 90%.`,
        `Dilengkapi fasilitas ramah difabel, jalur taktil, dan arena edukasi lingkungan.`,
        `Penambahan 1.000 biopori mempercepat penyerapan air hujan ke tanah.`
      ],
      url: 'https://www.kompas.com',
      source: 'Kompas Regional',
      image: getThematicNewsImage(`Taman Kota RTH Hijau Pohon Biopori ${cleanCity}`, 'Tata Kota & Jalan'),
      publishedAt: hoursAgo(11),
      category: 'Tata Kota & Jalan',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#RTH', '#KotaInklusif', '#SDG11'],
      verified: false,
      views: 620,
      sentiment: 'positive'
    }
  ];
}

// Highly contextual and accurate thematic image matcher for Indonesian urban & municipal news
export function getThematicNewsImage(title = '', category = '') {
  const lower = `${title} ${category}`.toLowerCase();

  // 1. Sungai / Normalisasi / Kali / Aliran / Waduk / Bendungan / Irigasi / Pengerukan / BBWS / Tanggul
  if (
    lower.includes('sungai') ||
    lower.includes('normalisasi') ||
    lower.includes('bbws') ||
    lower.includes('kali') ||
    lower.includes('amprong') ||
    lower.includes('brantas') ||
    lower.includes('ciliwung') ||
    lower.includes('bengawan') ||
    lower.includes('waduk') ||
    lower.includes('bendungan') ||
    lower.includes('pengerukan') ||
    lower.includes('tanggul') ||
    lower.includes('sedimentasi')
  ) {
    return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
  }

  // 2. Banjir / Hujan Lebat / Genangan / Air / Drainase / Pompa / Selokan / Gorong-gorong / Luapan
  if (
    lower.includes('banjir') ||
    lower.includes('genangan') ||
    lower.includes('drainase') ||
    lower.includes('selokan') ||
    lower.includes('hujan lebat') ||
    lower.includes('air bah') ||
    lower.includes('pompa air') ||
    lower.includes('luapan')
  ) {
    return 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80';
  }

  // 3. Cuaca / Cerah / Panas / Awan / Langit / Kabut / Kabur / Suhu / Angin / Iklim / Prakiraan
  if (
    lower.includes('cerah') ||
    lower.includes('udara kabur') ||
    lower.includes('kabut') ||
    lower.includes('langit') ||
    lower.includes('cuaca') ||
    lower.includes('suhu') ||
    lower.includes('panas') ||
    lower.includes('kemarau') ||
    lower.includes('berawan') ||
    lower.includes('iklim')
  ) {
    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1200&q=80';
  }

  // 4. Gempa / Bencana / Longsor / Vulkanik / Tsunami / Tim SAR / BPBD / Evakuasi
  if (
    lower.includes('gempa') ||
    lower.includes('longsor') ||
    lower.includes('tsunami') ||
    lower.includes('gunung') ||
    lower.includes('bencana') ||
    lower.includes('bpbd') ||
    lower.includes('evakuasi') ||
    lower.includes('sar')
  ) {
    return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80';
  }

  // 5. Jalan Rusak / Aspal / Lubang / Bina Marga / Proyek / Jembatan / Flyover / Trotoar / PJU / Lampu
  if (
    lower.includes('jalan') ||
    lower.includes('aspal') ||
    lower.includes('lubang') ||
    lower.includes('bina marga') ||
    lower.includes('jembatan') ||
    lower.includes('pju') ||
    lower.includes('lampu') ||
    lower.includes('trotoar') ||
    lower.includes('flyover') ||
    lower.includes('perbaikan')
  ) {
    return 'https://images.unsplash.com/photo-1584463688353-27c196413a91?auto=format&fit=crop&w=1200&q=80';
  }

  // 6. Transportasi / Macet / Lalu Lintas / Bus / Angkutan / Kendaraan / Parkir / Dishub
  if (
    lower.includes('macet') ||
    lower.includes('lalu lintas') ||
    lower.includes('transportasi') ||
    lower.includes('bus') ||
    lower.includes('angkot') ||
    lower.includes('dishub') ||
    lower.includes('kendaraan') ||
    lower.includes('parkir')
  ) {
    return 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80';
  }

  // 7. Smart City / IoT / Sensor / AI / Digital / CCTV / Aplikasi / Diskominfo / Komputer / Telemetri
  if (
    lower.includes('sensor') ||
    lower.includes('iot') ||
    lower.includes('smart city') ||
    lower.includes('cctv') ||
    lower.includes('digital') ||
    lower.includes('aplikasi') ||
    lower.includes('teknologi') ||
    lower.includes('ai') ||
    lower.includes('diskominfo')
  ) {
    return 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80';
  }

  // 8. Taman / RTH / Pohon / Hutan / Lingkungan / Hijau / Daur Ulang / Sampah / DLH / Kebersihan
  if (
    lower.includes('taman') ||
    lower.includes('rth') ||
    lower.includes('pohon') ||
    lower.includes('hutan') ||
    lower.includes('hijau') ||
    lower.includes('sampah') ||
    lower.includes('daur ulang') ||
    lower.includes('kebersihan') ||
    lower.includes('dlh')
  ) {
    return 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80';
  }

  // 9. Pelayanan / KTP / Dukcapil / Kantor / Pemkot / Walikota / Bupati / Rapat / Kebijakan / Sosialisasi
  if (
    lower.includes('pelayanan') ||
    lower.includes('ktp') ||
    lower.includes('dukcapil') ||
    lower.includes('pemkot') ||
    lower.includes('pemkab') ||
    lower.includes('walikota') ||
    lower.includes('bupati') ||
    lower.includes('kebijakan') ||
    lower.includes('dprd')
  ) {
    return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80';
  }

  // 10. Kesehatan / Puskesmas / RSUD / Posyandu / Bansos / Warga
  if (
    lower.includes('puskesmas') ||
    lower.includes('rsud') ||
    lower.includes('kesehatan') ||
    lower.includes('vaksin') ||
    lower.includes('bansos') ||
    lower.includes('posyandu')
  ) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80';
  }

  // Default City Architecture
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
}
