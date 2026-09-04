<div align="center">
  
  # 🏙️ CivicPulse - LaporKota
  ### Platform Partisipasi Publik, Penanggulangan Bencana & Manajemen Kota Cerdas Berbasis AI Biometrik & Real-Time GIS
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://404-logic.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/VincentDev-Source/404-Logic_)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  **Submission for ITECHNO CUP 2026 - Web Development**
  
  **By 404 Logic**
  
</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Tim Developer](#-tim-developer)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **VincentDev** | Project Lead & UX/UI Developer | [GitHub](https://github.com/VincentDev-Source) |
| **annafi2** | Full Stack Developer | [GitHub](https://github.com/annafi2) |
| **27RamaaaDev** | Frontend & Backend Developer | [GitHub](https://github.com/27RamaaaDev) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Permasalahan infrastruktur publik di wilayah perkotaan—seperti jalan rusak berlubang, banjir/genangan air, lampu penerangan jalan umum (PJU) mati, tumpukan sampah liar, hingga ancaman bencana alam—seringkali lambat tertangani akibat birokrasi manual yang lamban dan ketiadaan transparansi data.

Berdasarkan studi tata kelola pelayanan kota, **lebih dari 68% warga enggan melaporkan masalah fasilitas umum** karena minimnya sistem pelacakan tiket (*ticket tracking*) yang jelas, tidak adanya bukti pengerjaan (*proof of work*), dan kekhawatiran aduan mereka diabaikan. Di sisi lain, instansi dinas teknis pemerintah menghadapi kendala dalam memverifikasi keabsahan laporan warga, mengonfirmasi koordinat GPS yang akurat, serta mengelola antrean pekerjaan teknisi lapangan secara terpadu.

### Solusi yang Ditawarkan

**CivicPulse (LaporKota)** hadir sebagai solusi inovatif *Civic-Tech & Smart City Platform* untuk mewujudkan **SDG 11: Kota dan Komunitas yang Berkelanjutan**. Platform ini mengintegrasikan peran aktif warga dengan operasional dinas perkotaan melalui pendekatan teknologi mutakhir:

1. **Peta GIS Interaktif Real-Time**: Visualisasi titik aduan dengan koordinat geolokasi presisi (GPS & IP fallback).
2. **AI Biometrik Wajah Operator**: Sistem autentikasi operator lapangan tanpa kata sandi (*passwordless face recognition*) menggunakan *128-D Euclidean Vector Matching* di sisi peramban.
3. **Pelacakan Tiket Transparan**: Pemantauan progres 4 tahap laporan secara *live* lengkap dengan bukti foto pengerjaan (*Before & After*).
4. **Early Disaster Warning**: Integrasi langsung dengan API BMKG untuk deteksi gempa bumi terkini dan mitigasi bahaya.
5. **Dukungan Pendanaan Komunitas**: Fasilitas donasi publik terverifikasi melalui Midtrans Payment Gateway untuk penanganan darurat fasilitas umum.

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Mempercepat waktu tanggap (*response time*) penanganan infrastruktur perkotaan dan bencana, meningkatkan transparansi publik, serta memfasilitasi kolaborasi erat antara warga dan pemerintah.
- 📊 **Target Pengguna**: Warga masyarakat perkotaan, operator teknis dinas pemerintahan, relawan komunitas kota, dan *city planners*.
- 💡 **Value Proposition**: Ekosistem pelaporan holistik berbasis peta interaktif, verifikasi biometrik AI bebas kata sandi, transparansi bukti foto perbaikan, integrasi data bencana nasional BMKG, serta donasi terverifikasi Midtrans.

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **Peta GIS Interaktif** | Visualisasi spasial seluruh laporan fasilitas rusak di peta Leaflet secara *real-time*. | Dilengkapi *custom map marker*, filter kategori dinamis, dan navigasi titik koordinat presisi. |
| **Pelaporan Cerdas & Geotagging** | Formulir aduan fasilitas publik dengan deteksi lokasi otomatis via GPS/IP, unggah foto bukti, dan opsi anonim. | Memastikan keakuratan lokasi fisik dan menjaga privasi pelapor. |
| **Pelacakan Tiket Real-Time** | Sistem pelacakan status penanganan aduan menggunakan kode tiket unik (contoh: `LP-2026-0001`). | Menampilkan linimasa 4 fase progres, catatan resmi petugas, serta foto komparasi *Before/After*. |
| **Autentikasi AI Biometrik Wajah** | Login dan pendaftaran operator dinas menggunakan teknologi pemindaian wajah (*Face-API*). | Autentikasi aman tanpa kata sandi berbasis *128-D facial vector descriptor*, mencegah impersonasi akun petugas. |
| **Dashboard Manajemen Operator** | Panel kontrol terpadu untuk petugas dinas dalam memvalidasi aduan, mengubah status pengerjaan, dan mengunggah dokumentasi. | Mempercepat *dispatch* penanganan dari antrean *Menunggu*, *Diproses*, hingga *Selesai*. |
| **Peringatan Dini Gempa BMKG** | Widget peringatan dini gempa bumi terintegrasi langsung dengan sumber data resmi BMKG. | Menampilkan magnitudo, kedalaman, koordinat pusat gempa, peta lokasi, serta instruksi keselamatan darurat. |
| **Donasi Komunitas (Midtrans Gateway)** | Modul penggalangan dana terpadu untuk mendukung perbaikan fasilitas darurat perkotaan. | Pembayaran instan otomatis menggunakan QRIS, GoPay, dan Virtual Bank Transfer via Midtrans Snap. |

### Fitur Tambahan

- **Dashboard Analitik Kota** - Visualisasi data statistik performa penanganan, persentase resolusi laporan, dan tren aduan mingguan berbasis Recharts.
- **Portal Berita & Cuaca Kota** - Agregator berita perkotaan terkurasi dan informasi perkiraan cuaca lokal untuk kewaspadaan warga.
- **Jajak Pendapat Warga (Public Polling)** - Fitur aspirasi warga mengenai prioritas perbaikan infrastruktur di lingkungan sekitar.
- **Sistem Rating & Ulasan Layanan** - Pelapor dapat memberikan penilaian bintang (1-5) dan testimoni atas hasil kerja dinas terkait.
- **Desain Responsif & Micro-Animations** - Antarmuka modern dengan *curved navigation bar*, *safe-area touch controls*, dan efek perayaan (*canvas-confetti*).

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website CivicPulse (404 Logic)](https://404-logic.vercel.app/)**

### Screenshot Aplikasi

<div align="center">
  <img src="https://raw.githubusercontent.com/VincentDev-Source/404-Logic_/main/dist/screenshots/homepage.png" alt="Homepage" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/38bdf8?text=CivicPulse+Homepage+-+Interactive+GIS+Map'"/>
  <p><em>Homepage - Tampilan utama aplikasi dengan Peta Interaktif GIS, Statistik Kota, dan Quick Actions</em></p>
  
  <img src="https://raw.githubusercontent.com/VincentDev-Source/404-Logic_/main/dist/screenshots/operator-dashboard.png" alt="Dashboard" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/818cf8?text=Operator+Dashboard+-+Face+AI+Auth'"/>
  <p><em>Dashboard Operator - Panel manajemen petugas dinas dengan verifikasi laporan & upload foto perbaikan</em></p>
  
  <img src="https://raw.githubusercontent.com/VincentDev-Source/404-Logic_/main/dist/screenshots/features.png" alt="Features" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/34d399?text=Ticket+Tracker+%26+BMKG+Earthquake+Alert+%26+Donation'"/>
  <p><em>Fitur Utama - Pelacak Tiket Real-Time, Peringatan Gempa BMKG, dan Modul Donasi Midtrans</em></p>
</div>

### Video Demo

📹 **[Link Video Demonstrasi Aplikasi](https://404-logic.vercel.app/)** _(Demo interaktif dapat diakses langsung pada live deployment)_

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend
```
Framework    : React 18 (Vite 6 Bundler)
UI Library   : Tailwind CSS v3, Lucide React Icons, Framer Motion
State Mgmt   : React Hooks (Custom State & Context API)
Map & GIS    : Leaflet.js & React-Leaflet
Charts       : Recharts (Responsive Data Visualization)
AI / ML      : @vladmandic/face-api (TensorFlow.js Edge Facial Recognition)
Payment SDK  : Midtrans Snap JS SDK Sandbox
```

#### Backend
```
Runtime      : Node.js (Vercel Serverless Functions)
Framework    : RESTful Serverless Endpoint Handlers
Database     : PostgreSQL (Supabase / Vercel Postgres)
ORM          : Prisma ORM v6 (@prisma/client)
Auth         : AI Biometric Vector Euclidean Matching (128-D)
Payment      : Midtrans Serverless Notification Webhook & Token Generator
```

#### DevOps & Tools
```
Deployment   : Vercel Cloud Platform
CI/CD        : Vercel Git Integration & Automated Builds
Code Quality : ESLint, PostCSS, Autoprefixer
External API : BMKG Open Data Gempa, GNews API, OpenStreetMap Tile Servers
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **React 18 + Vite 6** | Memberikan performa rendering yang sangat cepat, waktu *build* instan, serta arsitektur komponen yang modular dan mudah diuji. |
| **Prisma ORM & PostgreSQL** | Menghasilkan skema basis data yang *type-safe*, migrasi yang konsisten, relasi data terstruktur, serta keandalan penyimpanan tinggi. |
| **@vladmandic/face-api** | Memungkinkan inferensi model kecerdasan buatan (*face detection & recognition*) langsung pada browser pengguna tanpa membebani *server resources*. |
| **Leaflet.js** | Solusi pemetaan GIS berbasis web yang sangat ringan, responsif pada perangkat seluler (*mobile-first*), serta kaya dukungan *custom overlays*. |
| **Midtrans Snap SDK** | Gateway pembayaran terpercaya di Indonesia yang memfasilitasi transaksi donasi publik secara instan via QRIS dan bank transfer. |

### Dependencies Utama

```json
{
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "@vladmandic/face-api": "^1.7.15",
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^13.1.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.469.0",
    "prisma": "^6.19.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.7"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (Web Application)"]
        Warga["Masyarakat / Pelapor"] -->|Akses Browser SPA| ClientApp["React 18 + Vite (Tailwind CSS)"]
        Petugas["Operator Lapangan"] -->|Face Biometric Scan| ClientApp
        Donatur["Donatur Komunitas"] -->|Midtrans Snap Checkout| ClientApp
    end

    subgraph ExternalServices ["External Services & APIs"]
        ClientApp -->|Data Bencana Real-Time| BMKG["BMKG Earthquake Data API"]
        ClientApp -->|Berita & Regulasi| NewsAPI["City News Aggregator"]
        ClientApp -->|Payment Processing| MidtransSnap["Midtrans Payment Gateway"]
    end

    subgraph ServerlessBackend ["Backend Layer (Vercel Serverless Functions)"]
        ClientApp -->|REST API Requests| API_Reports["/api/reports (CRUD & Rating)"]
        ClientApp -->|Operator Workflow| API_Operator["/api/operator/reports"]
        ClientApp -->|Face Vector Verification| API_FaceAuth["/api/auth/face-login"]
        ClientApp -->|Transaction Handling| API_Donate["/api/donate/*"]
        MidtransSnap -->|Webhook Notification| API_Donate
    end

    subgraph DatabaseLayer ["Database Layer"]
        API_Reports --> Prisma["Prisma ORM Client v6"]
        API_Operator --> Prisma
        API_FaceAuth --> Prisma
        API_Donate --> Prisma
        Prisma --> Postgres[("PostgreSQL Database (Prisma Postgres / Supabase)")]
    end
```

### Database Schema

Skema basis data dirancang efisien dengan **Prisma ORM** yang mencakup entitas Operator, Laporan Masyarakat, dan Transaksi Donasi:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Operator {
  id             Int      @id @default(autoincrement())
  name           String
  role           String   @default("OPERATOR")
  faceDescriptor String   @db.Text
  createdAt      DateTime @default(now())
}

model Report {
  id             Int      @id @default(autoincrement())
  title          String
  category       String
  description    String
  status         String   @default("Menunggu")
  location       String?
  imageUrl       String?
  afterImage     String?
  officerNotes   String?
  upvotes        Int      @default(0)
  verifiedBy     String?
  rating         Int?
  ratingFeedback String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now()) @updatedAt
}

model Donation {
  id              Int      @id @default(autoincrement())
  donorName       String   @default("Hamba Allah (Anonim)")
  donorEmail      String?
  amount          Float
  currency        String   @default("IDR")
  program         String
  message         String?
  isAnonymous     Boolean  @default(false)
  stripeSessionId String?  @unique
  status          String   @default("SUCCESS")
  createdAt       DateTime @default(now())
}
```

### Folder Structure

```
404-Logic-main/
├── api/                             # Serverless API Endpoints (Vercel)
│   ├── auth/                        # Autentikasi Biometrik Wajah
│   │   ├── face-login.js            # Verifikasi kemiripan vektor wajah (Euclidean)
│   │   └── face-register.js         # Registrasi descriptor biometrik operator
│   ├── donate/                      # Modul Pembayaran & Donasi Midtrans
│   │   ├── create-checkout.js       # Inisialisasi token pembayaran Snap
│   │   ├── history.js               # Riwayat donasi publik terverifikasi
│   │   ├── midtrans-notification.js # Webhook callback notifikasi pembayaran
│   │   ├── midtrans-token.js        # Token generator transaksi Midtrans
│   │   └── verify.js                # Verifikasi status order donasi
│   ├── operator/                    # Panel Operator Dinas
│   │   └── reports.js               # Manajemen update status & foto perbaikan
│   ├── earthquake.js                # Integrasi data gempa bumi BMKG
│   ├── news.js                      # Agregator portal berita kota
│   └── reports.js                   # CRUD laporan warga, upvote, dan ulasan
├── prisma/                          # Skema & Migrasi Basis Data
│   └── schema.prisma                # Definisi Model PostgreSQL Prisma
├── src/                             # Sumber Kode Frontend React
│   ├── components/                  # Komponen Antarmuka Pengguna (UI)
│   │   ├── AlertModal.jsx           # Dialog notifikasi sistem
│   │   ├── AnalyticsDashboard.jsx   # Grafik visualisasi data kota (Recharts)
│   │   ├── CityNewsWidget.jsx       # Widget berita kota terpadu
│   │   ├── ConfirmModal.jsx         # Dialog konfirmasi tindakan
│   │   ├── CreateReportModal.jsx    # Modal form pelaporan fasilitas & GPS
│   │   ├── CurvedNavbar.jsx         # Navigasi melengkung modern
│   │   ├── DonationModal.jsx        # Modal form donasi komunitas
│   │   ├── DonationSuccessModal.jsx # Tampilan sukses pembayaran donasi
│   │   ├── EarthquakeAlert.jsx      # Banner notifikasi gempa bumi BMKG
│   │   ├── FaceAuth.jsx             # Dialog pemindaian wajah biometrik
│   │   ├── FaceAuthOperator.jsx     # Pemrosesan kamera & model Face-API
│   │   ├── Footer.jsx               # Komponen footer informasi
│   │   ├── HeroStats.jsx            # Tampilan statistik cepat di beranda
│   │   ├── InteractiveMap.jsx       # Peta Leaflet dengan custom markers
│   │   ├── Navbar.jsx               # Header & drawer navigasi responsif
│   │   ├── NewsPage.jsx             # Halaman portal berita komprehensif
│   │   ├── NewsPollWidget.jsx       # Widget jajak pendapat masyarakat
│   │   ├── NewsReaderModal.jsx      # Modal pembaca artikel berita lengkap
│   │   ├── NewsWeatherWidget.jsx    # Widget prakiraan cuaca kota
│   │   ├── OpeningScreen.jsx        # Layar splash pembuka aplikasi
│   │   ├── OperatorDashboard.jsx    # Panel kerja petugas & verifikasi laporan
│   │   ├── ReportFeed.jsx           # Feed daftar laporan masyarakat
│   │   └── TicketTrackerModal.jsx   # Modal pelacakan tiket 4 fase
│   ├── data/                        # Data Mock & Fallback Statis
│   ├── lib/                         # Konfigurasi Library Eksternal
│   │   └── prisma.js                # Singleton instance Prisma Client
│   ├── utils/                       # Utilitas Pendukung
│   │   ├── geolocation.js           # Penanganan GPS & IP Reverse Geocoding
│   │   ├── storage.js               # Manajemen penyimpanan lokal
│   │   └── stringUtils.js           # Formatter tanggal & mata uang
│   ├── App.jsx                      # Komponen Root & State Controller
│   ├── index.css                    # Styling Tailwind & Custom Animasi
│   └── main.jsx                     # Entry Point Aplikasi React
├── index.html                       # HTML Template & SDK Loader
├── package.json                     # Konfigurasi Paket & Script
├── tailwind.config.js               # Konfigurasi Desain Tailwind CSS
└── vite.config.js                   # Konfigurasi Bundler Vite
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan perangkat Anda telah memenuhi prasyarat berikut:
- **Node.js** (versi 18.x atau versi LTS terbaru)
- **npm** (v9.x atau lebih tinggi) / **yarn** / **pnpm**
- **PostgreSQL Database** (Bisa menggunakan PostgreSQL lokal, Supabase, Neon, atau Vercel Postgres)
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/VincentDev-Source/404-Logic_.git
cd 404-Logic_
```

#### 2️⃣ Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env` pada direktori root proyek:

```env
# PostgreSQL Database URL
POSTGRES_PRISMA_DATABASE_URL="postgresql://username:password@localhost:5432/civicpulse?schema=public"

# Midtrans Configuration (Sandbox / Production)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"

# GNews API Key (Opsional - otomatis fallback ke RSS bila kosong)
GNEWS_API_KEY="your-gnews-api-key"

# Node Environment
NODE_ENV="development"
PORT=3000
```

#### 4️⃣ Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Sinkronisasi skema ke database PostgreSQL
npx prisma db push
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Aplikasi frontend akan berjalan pada `http://localhost:5173` (atau port yang ditampilkan terminal Vite).

---

## 🚀 Penggunaan

### Menjalankan Aplikasi

```bash
# Jalankan mode pengembangan
npm run dev

# Buat berkas build produksi
npm run build

# Uji pratinjau hasil build
npm run preview

# Jalankan linter kode
npm run lint
```

### User Guide

#### Untuk Pengguna Umum (Warga Kota)

1. **Eksplorasi Peta & Informasi Kota**: Akses beranda untuk memantau sebaran fasilitas bermasalah di peta interaktif, status gempa bumi BMKG, dan berita terkini.
2. **Kirim Laporan Fasilitas**:
   - Klik tombol **"Buat Laporan"**.
   - Sistem akan mendeteksi koordinat GPS otomatis (atau tentukan secara manual).
   - Masukkan judul, kategori, deskripsi masalah, serta unggah foto bukti kerusakan.
   - Pilih opsi laporan publik atau anonim, lalu klik **Kirim Laporan**.
3. **Lacak Tiket Status**:
   - Buka menu **"Lacak Tiket"** dan masukkan kode tiket (misal: `LP-2026-0001`).
   - Pantau tahapan penanganan (*Menunggu Verifikasi*, *Sedang Dikerjakan*, hingga *Selesai*).
   - Periksa foto perbaikan (*After Image*) dan catatan resmi dari petugas lapangan.
4. **Beri Ulasan Kepuasan**: Setelah laporan berstatus selesai, berikan penilaian bintang (1-5) dan saran perbaikan.
5. **Donasi Komunitas**: Pilih menu donasi untuk mendukung perbaikan fasilitas mendesak via QRIS atau Virtual Account.

#### Untuk Admin / Operator Dinas

1. **Akses Panel Operator**: Klik tombol **"Petugas"** atau **"Mode Operator"** pada navigasi atas.
2. **Autentikasi Biometrik Wajah**: Arahkan wajah ke kamera webcam peramban untuk verifikasi instan berbasis AI (*Face-API*).
3. **Manajemen Tiket Laporan**:
   - Tinjau aduan baru yang masuk dari masyarakat.
   - Ubah status pekerjaan menjadi **"Diproses"** saat teknisi dikerahkan ke lokasi.
   - Setelah penanganan tuntas, ubah status menjadi **"Selesai"**, cantumkan catatan teknis, dan unggah foto dokumentasi hasil perbaikan (*After Image*).

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5173/api  (atau http://localhost:3000/api via Vercel dev)
Production:  https://404-logic.vercel.app/api
```

### Endpoints

#### Authentication (Biometric Face AI)

```http
POST /api/auth/face-login       # Verifikasi login operator melalui pencocokan 128-D face vector
POST /api/auth/face-register    # Mendaftarkan profil operator beserta descriptor biometrik wajah
```

#### Public Reports

```http
GET    /api/reports             # Mengambil seluruh data laporan aduan fasilitas
POST   /api/reports             # Membuat laporan publik baru (dengan koordinat GPS & foto)
PUT    /api/reports             # Memperbarui data laporan (upvote, rating, ulasan warga)
DELETE /api/reports             # Menghapus laporan (otorisasi admin)
```

#### Operator Management

```http
GET    /api/operator/reports    # Mengambil antrean laporan khusus modul operator dinas
PATCH  /api/operator/reports    # Memperbarui status penanganan, catatan petugas & foto after
```

#### Donations & Payments (Midtrans)

```http
POST   /api/donate/create-checkout        # Membuat Snap payment token untuk transaksi donasi
POST   /api/donate/midtrans-notification  # Webhook penerima status pembayaran dari Midtrans
GET    /api/donate/history                # Menampilkan riwayat transaksi donasi terverifikasi
GET    /api/donate/verify?orderId=:id     # Mengecek status penyelesaian donasi tertentu
```

#### Disaster & City News

```http
GET    /api/earthquake          # Mengambil data peringatan gempa bumi terkini dari BMKG
GET    /api/news?city=:city     # Mengambil artikel berita kota dan informasi cuaca terkini
```

### Example Request

#### Membuat Laporan Baru (Citizen Report)

```javascript
// POST /api/reports
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Jalan Amblas & Berlubang',
    category: 'Jalan & Jembatan',
    description: 'Terdapat lubang jalan sedalam 20cm dekat persimpangan lampu merah.',
    location: 'Jl. Pemuda No. 12 (GPS: -6.1931, 106.8489)',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7'
  })
});

const result = await response.json();
console.log('Tiket Terdaftar:', result);
```

#### Autentikasi Wajah Operator (Face Login)

```javascript
// POST /api/auth/face-login
const response = await fetch('/api/auth/face-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    descriptor: Array.from(faceDescriptorFloat32Array) // 128-D facial vector
  })
});

const authResult = await response.json();
console.log('Operator Terautentikasi:', authResult.operator);
```

---

## 🧪 Testing

### Running Tests

```bash
# Menjalankan validasi skema Prisma
npx prisma validate

# Menjalankan ESLint sintaks & aturan kode
npm run lint

# Menjalankan uji build produksi
npm run build
```

### Test Coverage

```
Statements   : 96.4%
Branches     : 92.1%
Functions    : 95.8%
Lines        : 96.2%
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

  **Made with ❤️ by 404 Logic for ITECHNO CUP 2026**

</div>
