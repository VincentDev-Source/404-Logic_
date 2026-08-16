// Data Transportasi Darat Indonesia - NusaTransit

export const INDONESIA_STATIONS = [
  { id: 'GMR', name: 'Stasiun Gambir', city: 'Jakarta Pusat', lat: -6.1767, lng: 106.8306, type: 'KAI Utama', line: 'Jalur Utara & Selatan' },
  { id: 'PSE', name: 'Stasiun Pasar Senen', city: 'Jakarta Pusat', lat: -6.1748, lng: 106.8436, type: 'KAI Ekonomi/Campuran', line: 'Jalur Utara' },
  { id: 'HLM', name: 'Stasiun WHOOSH Halim', city: 'Jakarta Timur', lat: -6.2464, lng: 106.8860, type: 'Kereta Cepat WHOOSH', line: 'KCIC Fast Train' },
  { id: 'BD', name: 'Stasiun Bandung', city: 'Bandung', lat: -6.9147, lng: 107.6025, type: 'KAI Utama', line: 'Jalur Selatan' },
  { id: 'TGL', name: 'Stasiun WHOOSH Tegalluar', city: 'Kab. Bandung', lat: -6.9632, lng: 107.7126, type: 'Kereta Cepat WHOOSH', line: 'KCIC Fast Train' },
  { id: 'CN', name: 'Stasiun Cirebon', city: 'Cirebon', lat: -6.7053, lng: 108.5554, type: 'KAI Transit', line: 'Jalur Utama Jawa' },
  { id: 'SMT', name: 'Stasiun Semarang Tawang', city: 'Semarang', lat: -6.9644, lng: 110.4281, type: 'KAI Utama', line: 'Jalur Utara' },
  { id: 'YK', name: 'Stasiun Yogyakarta (Tugu)', city: 'Yogyakarta', lat: -7.7892, lng: 110.3635, type: 'KAI Utama & KRL', line: 'Jalur Selatan' },
  { id: 'SLO', name: 'Stasiun Solo Balapan', city: 'Surakarta', lat: -7.5566, lng: 110.8219, type: 'KAI Utama & KRL', line: 'Jalur Selatan' },
  { id: 'SBI', name: 'Stasiun Surabaya Pasarturi', city: 'Surabaya', lat: -7.2474, lng: 112.7306, type: 'KAI Utama', line: 'Jalur Utara' },
  { id: 'SGU', name: 'Stasiun Surabaya Gubeng', city: 'Surabaya', lat: -7.2654, lng: 112.7521, type: 'KAI Utama', line: 'Jalur Selatan' },
  { id: 'ML', name: 'Stasiun Malang', city: 'Malang', lat: -7.9782, lng: 112.6375, type: 'KAI Utama', line: 'Jalur Selatan' },
  { id: 'MDN', name: 'Stasiun Medan', city: 'Medan', lat: 3.5908, lng: 98.6787, type: 'KAI Sumatra', line: 'Divre I SU' },
  { id: 'DPS', name: 'Terminal Ubung', city: 'Denpasar Bali', lat: -8.6339, lng: 115.1950, type: 'Terminal Bus Bali', line: 'Lintas Bali-Jawa' }
];

export const REALTIME_TRAINS = [
  {
    id: 'WHOOSH-G112',
    name: 'WHOOSH G112',
    category: 'Kereta Cepat',
    operator: 'KCIC',
    origin: 'Stasiun WHOOSH Halim',
    destination: 'Stasiun WHOOSH Tegalluar',
    speed: 342, // km/h
    status: 'Beroperasi (Lancar)',
    delayMinutes: 0,
    occupancy: 88,
    color: '#ef4444',
    currentPos: { lat: -6.6000, lng: 107.3000 },
    routePoints: [
      [-6.2464, 106.8860], // Halim
      [-6.3500, 107.1700], // Karawang
      [-6.8500, 107.4700], // Padalarang
      [-6.9632, 107.7126]  // Tegalluar
    ],
    nextStation: 'Padalarang',
    etaNextStation: '06 Menit',
    facilities: ['Wi-Fi 5G Free', 'Power Outlet 220V', 'Restoran Kereta', 'Kursi First Class', 'Full AC'],
    ticketPrice: 250000
  },
  {
    id: 'KA-7001',
    name: 'Argo Bromo Anggrek',
    category: 'KAI Eksekutif Luxury',
    operator: 'PT KAI (Persero)',
    origin: 'Stasiun Gambir',
    destination: 'Stasiun Surabaya Pasarturi',
    speed: 115,
    status: 'Tepat Waktu',
    delayMinutes: 0,
    occupancy: 94,
    color: '#3b82f6',
    currentPos: { lat: -6.8000, lng: 109.5000 },
    routePoints: [
      [-6.1767, 106.8306], // Gambir
      [-6.7053, 108.5554], // Cirebon
      [-6.9644, 110.4281], // Semarang
      [-7.2474, 112.7306]  // Surabaya Pasarturi
    ],
    nextStation: 'Semarang Tawang',
    etaNextStation: '22 Menit',
    facilities: ['Reclining Seat', 'Selimut & Bantal', 'Makan Malam Gratis (Luxury)', 'Stopkontak', 'Layar AVOD'],
    ticketPrice: 620000
  },
  {
    id: 'KA-7025',
    name: 'Argo Parahyangan',
    category: 'KAI Eksekutif & Ekonomi',
    operator: 'PT KAI (Persero)',
    origin: 'Stasiun Gambir',
    destination: 'Stasiun Bandung',
    speed: 85,
    status: 'Tepat Waktu',
    delayMinutes: 0,
    occupancy: 76,
    color: '#10b981',
    currentPos: { lat: -6.5000, lng: 107.2000 },
    routePoints: [
      [-6.1767, 106.8306],
      [-6.2361, 106.9902],
      [-6.8731, 107.5422],
      [-6.9147, 107.6025]
    ],
    nextStation: 'Cimahi',
    etaNextStation: '14 Menit',
    facilities: ['Reclining Seat', 'Full AC', 'Kereta Makan', 'Charging Station'],
    ticketPrice: 150000
  },
  {
    id: 'KA-7012',
    name: 'Taksaka Malam',
    category: 'KAI Eksekutif Hype Trip',
    operator: 'PT KAI (Persero)',
    origin: 'Stasiun Gambir',
    destination: 'Stasiun Yogyakarta',
    speed: 105,
    status: 'Tepat Waktu',
    delayMinutes: 0,
    occupancy: 91,
    color: '#8b5cf6',
    currentPos: { lat: -7.3500, lng: 109.2000 },
    routePoints: [
      [-6.1767, 106.8306],
      [-6.7053, 108.5554],
      [-7.4243, 109.2304],
      [-7.7892, 110.3635]
    ],
    nextStation: 'Purwokerto',
    etaNextStation: '11 Menit',
    facilities: ['Hype Trip Ambiance', 'Wi-Fi Onboard', 'Snack Bar', 'Colokan Charger'],
    ticketPrice: 480000
  },
  {
    id: 'KRL-4120',
    name: 'KRL Commuter Line Bogor',
    category: 'Commuter Line',
    operator: 'KAI Commuter',
    origin: 'Stasiun Jakarta Kota',
    destination: 'Stasiun Bogor',
    speed: 68,
    status: 'Lancar',
    delayMinutes: 1,
    occupancy: 82,
    color: '#f59e0b',
    currentPos: { lat: -6.4000, lng: 106.8000 },
    routePoints: [
      [-6.1376, 106.8146],
      [-6.2098, 106.8494],
      [-6.4025, 106.7942],
      [-6.5944, 106.7892]
    ],
    nextStation: 'Depok Baru',
    etaNextStation: '03 Menit',
    facilities: ['Gerbong Khusus Wanita', 'AC Central', 'Pegangan Tangan Ergonomis', 'Display Informasi Digital'],
    ticketPrice: 6000
  }
];

export const OJOL_SERVICES = [
  {
    id: 'nusa-motor',
    name: 'NusaMotor',
    tagline: 'Solusi Cepat Bebas Macet',
    vehicle: 'Motor Honda Vario / Yamaha NMAX',
    baseFare: 8000,
    pricePerKm: 2500,
    icon: 'Bike',
    estimatedMin: '3-5 menit',
    capacity: '1 Penumpang',
    badge: 'PALING POPULER'
  },
  {
    id: 'nusa-car',
    name: 'NusaCar',
    tagline: 'Mobil Nyaman & Bersih',
    vehicle: 'Toyota Avanza / Daihatsu Xenia',
    baseFare: 14000,
    pricePerKm: 5000,
    icon: 'Car',
    estimatedMin: '5-8 menit',
    capacity: '4 Penumpang',
    badge: 'HEMAT'
  },
  {
    id: 'nusa-car-xl',
    name: 'NusaCar XL',
    tagline: 'Kapasitas Ekstra & Bagasi Luas',
    vehicle: 'Toyota Innova Zenix / Mitsubishi Xpander',
    baseFare: 22000,
    pricePerKm: 7500,
    icon: 'Truck',
    estimatedMin: '6-10 menit',
    capacity: '6 Penumpang',
    badge: 'KELUARGA'
  },
  {
    id: 'nusa-priority',
    name: 'NusaPriority',
    tagline: 'Pengalaman Premium Luxury',
    vehicle: 'Toyota Camry / Hyundai Ioniq 5 EV',
    baseFare: 35000,
    pricePerKm: 12000,
    icon: 'Sparkles',
    estimatedMin: '4-7 menit',
    capacity: '4 Penumpang',
    badge: 'PREMIUM'
  }
];

export const OJOL_PRESET_LOCATIONS = [
  {
    city: 'Jakarta',
    spots: [
      { name: 'Stasiun Gambir (Pintu Selatan)', lat: -6.1767, lng: 106.8306 },
      { name: 'Grand Indonesia Mall', lat: -6.1951, lng: 106.8202 },
      { name: 'Monumen Nasional (Monas)', lat: -6.1754, lng: 106.8272 },
      { name: 'Bandara Soekarno-Hatta T3', lat: -6.1256, lng: 106.6558 },
      { name: 'Stasiun WHOOSH Halim', lat: -6.2464, lng: 106.8860 }
    ]
  },
  {
    city: 'Bandung',
    spots: [
      { name: 'Stasiun Bandung (Pintu Utara)', lat: -6.9147, lng: 107.6025 },
      { name: 'Gedung Sate Bandung', lat: -6.9025, lng: 107.6186 },
      { name: 'Jl. Riau (Dago Shopping)', lat: -6.9077, lng: 107.6189 },
      { name: 'Stasiun WHOOSH Tegalluar', lat: -6.9632, lng: 107.7126 }
    ]
  },
  {
    city: 'Yogyakarta',
    spots: [
      { name: 'Stasiun Tugu Yogyakarta', lat: -7.7892, lng: 110.3635 },
      { name: 'Jalan Malioboro', lat: -7.7928, lng: 110.3658 },
      { name: 'Keraton Yogyakarta', lat: -7.8053, lng: 110.3642 },
      { name: 'Candi Prambanan', lat: -7.7520, lng: 110.4914 }
    ]
  },
  {
    city: 'Surabaya & Bali',
    spots: [
      { name: 'Stasiun Surabaya Pasarturi', lat: -7.2474, lng: 112.7306 },
      { name: 'Tunjungan Plaza Surabaya', lat: -7.2625, lng: 112.7378 },
      { name: 'Bandara Ngurah Rai Bali', lat: -8.7482, lng: 115.1672 },
      { name: 'Pantai Kuta Bali', lat: -8.7185, lng: 115.1686 }
    ]
  }
];

export const DUMMY_DRIVERS = [
  {
    id: 'DRV-8821',
    name: 'Budi Santoso',
    rating: 4.96,
    trips: '2,410 trip',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    vehicleName: 'Honda Vario 160 Black',
    plateNumber: 'B 4040 NSI',
    phone: '+62 812-9843-1102',
    joinedYears: '3 Tahun'
  },
  {
    id: 'DRV-5542',
    name: 'Asep Ridwan',
    rating: 4.92,
    trips: '1,890 trip',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    vehicleName: 'Toyota Avanza Veloz White',
    plateNumber: 'D 1945 TSD',
    phone: '+62 857-3321-0988',
    joinedYears: '4 Tahun'
  },
  {
    id: 'DRV-9011',
    name: 'I Made Suardana',
    rating: 4.98,
    trips: '3,100 trip',
    photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    vehicleName: 'Hyundai Ioniq 5 Midnight Silver',
    plateNumber: 'DK 888 NUSA',
    phone: '+62 819-0099-2341',
    joinedYears: '2 Tahun'
  }
];

export const BUS_SHUTTLE_SCHEDULES = [
  {
    id: 'BUS-01',
    operator: 'DAMRI Executive',
    route: 'Bandara Soekarno-Hatta → Stasiun Gambir',
    time: 'Setiap 30 Menit (05:00 - 23:00)',
    price: 80000,
    type: 'Bus Bandara Premium',
    amenities: ['AC', 'Reclining Seat', 'USB Charger', 'Bagasi Luas']
  },
  {
    id: 'BUS-02',
    operator: 'Cititrans Executive Shuttle',
    route: 'Jakarta (Central Park) → Bandung (Pasteur)',
    time: '07:00, 10:00, 14:00, 18:00, 20:30 WIB',
    price: 160000,
    type: 'Captain Seat Shuttle (8 Seat)',
    amenities: ['Captain Seat Ergonomis', 'Personal Screen', 'Air Purifier', 'Free Mineral Water']
  },
  {
    id: 'BUS-03',
    operator: 'Primajasa Interkota',
    route: 'Terminal Kampung Rambutan → Bandung Leuwipanjang',
    time: 'Setiap 20 Menit (24 Jam)',
    price: 75000,
    type: 'Bus AC Bisnis',
    amenities: ['AC Dual Zone', 'Bagasi Terlindungi', 'Jalur Tol']
  },
  {
    id: 'BUS-04',
    operator: 'DayTrans Shuttle',
    route: 'Yogyakarta (Gading) → Semarang (Pandanaran)',
    time: '06:00, 09:00, 13:00, 17:00 WIB',
    price: 110000,
    type: 'HiAce Commuter',
    amenities: ['AC', 'Rec-Seat', 'Colokan HP', 'Layanan Door to Shuttle']
  }
];

export const TERMINAL_FACILITIES = [
  {
    name: 'Stasiun Gambir Jakarta',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    facilities: ['VIP Executive Lounge', 'Lahan Parkir 24 Jam', 'Charging Station Gratis', 'Restoran & Cafe 24/7', 'Akses Disabilitas & Elevator', 'Pos Kesehatan'],
    description: 'Pusat pemberangkatan kereta api kelas eksekutif dan luxury terbaik di DKI Jakarta.'
  },
  {
    name: 'Stasiun WHOOSH Halim',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    facilities: ['Interkoneksi LRT Jabodebek', 'Sistem Gate Face Recognition', 'Area Kuliner Modern', 'Wi-Fi 5G Ultra-Fast', 'Ruang Menyusui/Nursery'],
    description: 'Stasiun modern berstandar internasional untuk Kereta Cepat Jakarta-Bandung.'
  },
  {
    name: 'Stasiun Yogyakarta (Tugu)',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    facilities: ['Koneksi KRL Jogja-Solo', 'Shower & Locker Room', 'Seni & Pertunjukan Budaya', 'Pusat Oleh-Oleh khas Jogja'],
    description: 'Ikon cagar budaya & pintu gerbang utama wisata Istimewa Yogyakarta.'
  }
];
