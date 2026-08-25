// Fallback news generator for client-side resiliency

export function getClientFallbackArticles(city = 'Jakarta') {
  const cleanCity = city.replace(/^(Kota|Kabupaten|Kab\.)\s+/i, '').trim() || 'Jakarta';
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  return [
    {
      id: `fallback-1-${cleanCity}`,
      title: `BMKG Rilis Peringatan Dini Cuaca Ekstrem & Potensi Hujan Lebat di Wilayah ${cleanCity}`,
      description: `Stasiun Meteorologi BMKG mengeluarkan status waspada cuaca ekstrem menyusul dinamika atmosfer, mengimbau warga ${cleanCity} meningkatkan kewaspadaan.`,
      fullContent: `Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) mengumumkan peringatan dini potensi cuaca ekstrem yang diprakirakan melanda sebagian besar wilayah ${cleanCity} hingga beberapa hari ke depan. Hujan dengan intensitas sedang hingga lebat yang disertai petir dan angin kencang berpotensi terjadi terutama pada siang hingga malam hari.\n\nBPBD ${cleanCity} telah menyiagakan posko tanggap darurat 24 jam dan tim reaksi cepat di titik-titik rawan genangan air. Warga diimbau untuk membersihkan saluran air mikro serta menghindari berteduh di bawah pohon rindang saat angin kencang melanda.`,
      aiSummary: [
        `BMKG menerbitkan status waspada hujan lebat dan angin kencang di ${cleanCity}.`,
        `BPBD menyiagakan posko 24 jam dan tim reaksi cepat di titik rawan banjir.`,
        `Warga diminta waspada saat berkendara dan menghindari parkir di bawah pohon rimbun.`
      ],
      url: 'https://www.bmkg.go.id',
      source: 'BMKG Indonesia',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(1),
      category: 'Bencana & Cuaca',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#BMKG', '#CuacaEkstrem', '#SDG11'],
      verified: true,
      views: 1420,
      sentiment: 'alert'
    },
    {
      id: `fallback-2-${cleanCity}`,
      title: `Dinas Bina Marga ${cleanCity} Percepat Tambal Lubang Jalan & Pasang 500 Unit PJU LED Pintar`,
      description: `Pemerintah Kota ${cleanCity} menggelar operasi perbaikan jalan rusak dan penggantian lampu penerangan jalan umum pintar hemat energi.`,
      fullContent: `Menindaklanjuti ratusan aduan masyarakat melalui portal CivicPulse, Dinas Bina Marga dan Penataan Ruang Kota ${cleanCity} menggelar aksi penambalan jalan aspal berlubang di sepanjang koridor arteri utama.\n\nSelain perbaikan jalan, program modernisasi Penerangan Jalan Umum (PJU) berbasis LED pintar dan tenaga surya juga resmi dimulai pada 500 titik rawan kecelakaan. Sistem pencahayaan baru ini terintegrasi dengan sensor otomatis yang dapat dipantau dari Command Center kota secara real-time guna efisiensi energi hingga 40%.`,
      aiSummary: [
        `Dinas Bina Marga mempercepat pengaspalan jalan rusak di jalur arteri ${cleanCity}.`,
        `Pemasangan 500 unit PJU pintar LED hemat energi terhubung ke pusat monitoring.`,
        `Tindakan ini merupakan respon langsung terhadap laporan aduan warga via CivicPulse.`
      ],
      url: 'https://www.detik.com',
      source: 'Dinas Bina Marga',
      image: 'https://images.unsplash.com/photo-1584463688353-27c196413a91?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(3),
      category: 'Tata Kota & Jalan',
      readTime: '3 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#Infrastruktur', '#PJUSmart', '#AduanWarga'],
      verified: true,
      views: 980,
      sentiment: 'positive'
    },
    {
      id: `fallback-3-${cleanCity}`,
      title: `Pemkot ${cleanCity} Terapkan Sensor Ketinggian Air IoT Terhubung CivicPulse untuk Deteksi Banjir Cepat`,
      description: `Inovasi teknologi smart city diterapkan di sungai utama ${cleanCity} guna memberikan notifikasi dini genangan air secara otomatis ke ponsel warga.`,
      fullContent: `Pemerintah Kota ${cleanCity} resmi meluncurkan uji coba integrasi sensor ultrasonik pendeteksi ketinggian air sungai berbasis Internet of Things (IoT). Sensor ini dipasang di 8 titik pintu air vital dan jembatan sungai utama.\n\nData telemetri yang dikirimkan setiap 10 detik secara otomatis diolah oleh sistem CivicPulse untuk memetakan status siaga (Siaga 1-4). Jika ketinggian air melebihi batas aman, warga dalam radius 2 kilometer akan menerima notifikasi waspada langsung sehingga evakuasi dini dapat dilakukan dengan aman dan terkoordinasi.`,
      aiSummary: [
        `Sensor IoT ultrasonik dipasang pada 8 titik pintu air vital di ${cleanCity}.`,
        `Data level air dipancarkan real-time setiap 10 detik ke peta interaktif.`,
        `Mendukung pencapaian target SDG 11.5 untuk kota tangguh bencana.`
      ],
      url: 'https://www.tempo.co',
      source: 'Diskominfo Smart City',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(5),
      category: 'Inovasi & Smart City',
      readTime: '3 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#SmartCity', '#SensorIoT', '#EarlyWarning'],
      verified: true,
      views: 850,
      sentiment: 'info'
    },
    {
      id: `fallback-4-${cleanCity}`,
      title: `Optimalisasi 15 Pompa Pengendali Banjir & Normalisasi Saluran Drainase Kawasan Padat ${cleanCity}`,
      description: `Dinas Sumber Daya Air memastikan seluruh rumah pompa dalam kondisi prima dan melakukan pengerukan endapan lumpur menjelang puncak curah hujan.`,
      fullContent: `Dinas Sumber Daya Air Pemkot ${cleanCity} melakukan inspeksi kelayakan operasional 15 stasiun pompa air utama. Seluruh genset cadangan dan pintu air otomatis telah selesai melalui masa pemeliharaan berkala.\n\nSelain itu, alat berat pengeruk lumpur dikerahkan di saluran primer perkotaan untuk menambah kapasitas tampung aliran debit air. Pemerintah juga mengajak warga untuk tidak membuang sampah ke aliran sungai demi mencegah penyumbatan saringan pompa.`,
      aiSummary: [
        `15 stasiun rumah pompa air pengendali banjir di ${cleanCity} siap beroperasi 100%.`,
        `Normalisasi saluran primer dan pengerukan sedimen lumpur terus dikebut.`,
        `Edukasi warga terkait larangan membuang sampah ke sungai terus digencarkan.`
      ],
      url: 'https://www.antaranews.com',
      source: 'Antara News',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(7),
      category: 'Bencana & Cuaca',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#MitigasiBanjir', '#PompaAir', '#DinasSDA'],
      verified: true,
      views: 740,
      sentiment: 'info'
    },
    {
      id: `fallback-5-${cleanCity}`,
      title: `Revitalisasi Ruang Terbuka Hijau & Fasilitas Ramah Disabilitas di Taman Kota ${cleanCity}`,
      description: `Kawasan taman kota dipercantik dengan penambahan jalur pedestrian bertekstur taktil, arena bermain anak inklusif, dan area resapan biopori.`,
      fullContent: `Pembangunan Ruang Terbuka Hijau (RTH) ramah inklusi di ${cleanCity} kini telah mencapai 90%. Proyek ini dirancang agar seluruh lapisan masyarakat, termasuk penyandang disabilitas dan lansia, dapat menikmati fasilitas publik dengan aman dan nyaman.\n\nSelain penataan lanskap taman, ditanam lebih dari 300 pohon peneduh serta dibuat 1.000 lubang biopori untuk konservasi air tanah dan pengurangan efek pulau panas perkotaan.`,
      aiSummary: [
        `Penyelesaian revitalisasi taman kota inklusif di ${cleanCity} mencapai 90%.`,
        `Dilengkapi fasilitas ramah difabel, jalur taktil, dan arena edukasi lingkungan.`,
        `Penambahan 1.000 biopori mempercepat penyerapan air hujan ke tanah.`
      ],
      url: 'https://www.kompas.com',
      source: 'Kompas Regional',
      image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(10),
      category: 'Tata Kota & Jalan',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#RTH', '#KotaInklusif', '#SDG11'],
      verified: false,
      views: 620,
      sentiment: 'positive'
    },
    {
      id: `fallback-6-${cleanCity}`,
      title: `Layanan Jemput Bola Pengurusan KTP & Dokumen Kependudukan Digital di Kelurahan ${cleanCity}`,
      description: `Dinas Dukcapil mempermudah pengurusan administrasi warga lewat posko mobil keliling gratis tanpa antrean panjang.`,
      fullContent: `Dinas Kependudukan dan Catatan Sipil (Disdukcapil) ${cleanCity} meluncurkan program pelayanan kependudukan langsung ke tingkat RW dan kelurahan. Warga dapat melakukan perekaman KTP-el, aktivasi Identitas Kependudukan Digital (IKD), serta pembaruan Kartu Keluarga tanpa harus datang ke kantor dinas pusat.\n\nProgram ini disambut antusias oleh masyarakat karena memangkas waktu pengurusan hingga kurang dari 15 menit melalui loket terpadu.`,
      aiSummary: [
        `Pelayanan dokumen kependudukan keliling jemput bola hadir di kelurahan ${cleanCity}.`,
        `Mendukung aktivasi IKD dan pengurusan dokumen keluarga secara gratis.`,
        `Waktu pemrosesan rata-rata hanya 15 menit per berkas pemohon.`
      ],
      url: 'https://www.republika.co.id',
      source: 'Disdukcapil Regional',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      publishedAt: hoursAgo(14),
      category: 'Layanan Publik',
      readTime: '2 min baca',
      tags: [`#${cleanCity.replace(/\s+/g, '')}`, '#LayananPublik', '#IKD', '#PelayananWarga'],
      verified: true,
      views: 510,
      sentiment: 'info'
    }
  ];
}
