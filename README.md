<div align="center">
  
  # 🏙️ CivicPulse - LaporKota
  ### Platform Partisipasi Publik, Penanggulangan Bencana & Manajemen Kota Cerdas Berbasis AI Biometrik & Real-Time GIS
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://404-logic.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/VincentDev-Source/404-Logic_)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com/VincentDev-Source/404-Logic_/blob/main/LICENSE)
  
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

Jalan berlubang, genangan air, lampu jalan mati, sampah liar, ancaman bencana alam — warga kota menghadapi masalah ini setiap hari, dan penanganannya sering terhambat di birokrasi manual dan data yang tidak transparan.

Sebagian besar warga tidak melapor. Mereka tidak tahu apakah aduan mereka sampai ke orang yang tepat, tidak ada bukti bahwa perbaikan benar-benar dikerjakan, dan tidak ada cara melacak progres setelah laporan dikirim. Di sisi dinas teknis, petugas kesulitan memverifikasi laporan warga, mengonfirmasi koordinat GPS yang akurat, dan mengatur antrean teknisi lapangan dalam satu sistem.

### Solusi yang Ditawarkan

CivicPulse (LaporKota) menghubungkan warga dan dinas kota lewat lima komponen, mendukung SDG 11 (Kota dan Komunitas yang Berkelanjutan):

1. **Peta GIS Interaktif Real-Time** — titik aduan divisualisasikan dengan koordinat presisi (GPS & IP fallback).
2. **AI Biometrik Wajah Operator** — operator lapangan login tanpa kata sandi lewat pencocokan vektor wajah 128-D di peramban.
3. **Pelacakan Tiket Transparan** — warga memantau 4 tahap progres laporan, dengan foto pengerjaan sebelum dan sesudah.
4. **Early Disaster Warning** — data gempa bumi terkini ditarik langsung dari API BMKG.
5. **Dukungan Pendanaan Komunitas** — donasi publik diproses lewat Midtrans untuk penanganan darurat fasilitas umum.

### Tujuan Proyek

- **Tujuan Utama**: mempercepat waktu tanggap penanganan infrastruktur dan bencana, membuat proses lebih transparan bagi warga, dan mempermudah kolaborasi antara warga dan pemerintah.
- **Target Pengguna**: warga kota, operator teknis dinas pemerintahan, relawan komunitas, dan perencana kota.
- **Yang membedakan platform ini**: peta interaktif sebagai pusat pelaporan, verifikasi operator lewat biometrik AI tanpa kata sandi, bukti foto untuk tiap perbaikan, data bencana nasional dari BMKG, dan donasi yang terverifikasi lewat Midtrans.

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **Peta GIS Interaktif** | Visualisasi spasial seluruh laporan fasilitas rusak di peta Leaflet secara real-time. | Custom map marker, filter kategori dinamis, dan navigasi titik koordinat presisi. |
| **Pelaporan Cerdas & Geotagging** | Formulir aduan fasilitas publik dengan deteksi lokasi otomatis via GPS/IP, unggah foto bukti, dan opsi anonim. | Lokasi fisik tercatat akurat, identitas pelapor tetap terjaga jika dipilih anonim. |
| **Pelacakan Tiket Real-Time** | Sistem pelacakan status penanganan aduan menggunakan kode tiket unik (contoh: `LP-2026-0001`). | Linimasa 4 fase progres, catatan resmi petugas, dan foto komparasi before/after. |
| **Autentikasi AI Biometrik Wajah** | Login dan pendaftaran operator dinas menggunakan pemindaian wajah (Face-API). | Autentikasi tanpa kata sandi berbasis descriptor wajah 128-D, mencegah impersonasi akun petugas. |
| **Dashboard Manajemen Operator** | Panel kontrol terpadu untuk petugas dinas dalam memvalidasi aduan, mengubah status pengerjaan, dan mengunggah dokumentasi. | Antrean kerja bergerak cepat dari Menunggu ke Diproses ke Selesai. |
| **Peringatan Dini Gempa BMKG** | Widget peringatan dini gempa bumi terintegrasi langsung dengan sumber data resmi BMKG. | Magnitudo, kedalaman, koordinat pusat gempa, peta lokasi, dan instruksi keselamatan darurat. |
| **Donasi Komunitas (Midtrans Gateway)** | Modul penggalangan dana terpadu untuk mendukung perbaikan fasilitas darurat perkotaan. | Pembayaran instan lewat QRIS, GoPay, dan Virtual Bank Transfer via Midtrans Snap. |

### Fitur Tambahan

- **Dashboard Analitik Kota** — statistik performa penanganan, persentase resolusi laporan, dan tren aduan mingguan berbasis Recharts.
- **Portal Berita & Cuaca Kota** — berita perkotaan terkurasi dan prakiraan cuaca lokal.
- **Jajak Pendapat Warga** — warga memberi suara pada prioritas perbaikan infrastruktur di lingkungan sekitar.
- **Sistem Rating & Ulasan Layanan** — pelapor menilai (1-5 bintang) dan memberi testimoni atas hasil kerja dinas terkait.
- **Desain Responsif & Micro-Animations** — curved navigation bar, safe-area touch controls, dan efek confetti saat laporan selesai.

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website CivicPulse (404 Logic)](https://404-logic.vercel.app/)**

### Screenshot Aplikasi

<div align="center">
<img width="1919" height="870" alt="Screenshot 2026-09-04 173725" src="https://github.com/user-attachments/assets/f4d7175e-7c7f-4094-8bfe-c0733f2b2171" />
  <p><em>Homepage - Tampilan utama aplikasi dengan Peta Interaktif GIS, Statistik Kota, dan Quick Actions</em></p>
  
<img width="1919" height="858" alt="Screenshot 2026-09-04 173756" src="https://github.com/user-attachments/assets/4bbeacd9-5c4c-4fa0-ac86-82129fb8301c" />
  <p><em>Dashboard Operator - Panel manajemen petugas dinas dengan verifikasi laporan & upload foto perbaikan</em></p>
  
<img width="647" height="717" alt="Screenshot 2026-09-04 173820" src="https://github.com/user-attachments/assets/c4290e5b-a1d1-4fd5-b9b4-ecd147b23389" />

  <p><em>Fitur Utama - Pelacak Tiket Real-Time, Peringatan Gempa BMKG, dan Modul Donasi Midtrans</em></p>
</div>

### Video Demo

📹 **[Link Video Demonstrasi Aplikasi](https://youtu.be/JfwdDW_2Rgk)** _(Demo interaktif dapat diakses langsung pada live deployment)_

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
| **React 18 + Vite 6** | Rendering cepat, build instan, komponen modular yang mudah diuji. |
| **Prisma ORM & PostgreSQL** | Skema type-safe, migrasi konsisten, relasi data terstruktur, penyimpanan yang stabil. |
| **@vladmandic/face-api** | Inferensi face detection & recognition berjalan langsung di browser pengguna, tanpa membebani server. |
| **Leaflet.js** | Pemetaan GIS ringan, responsif di perangkat seluler, mendukung custom overlays. |
| **Midtrans Snap SDK** | Gateway pembayaran yang umum dipakai di Indonesia, mendukung donasi instan via QRIS dan transfer bank. |

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

Skema database dibangun dengan Prisma ORM, mencakup entitas Operator, Laporan Masyarakat, dan Transaksi Donasi:

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

Sebelum mulai, siapkan:
- **Node.js** (versi 18.x atau LTS terbaru)
- **npm** (v9.x atau lebih tinggi) / **yarn** / **pnpm**
- **PostgreSQL Database** (lokal, Supabase, Neon, atau Vercel Postgres)
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

Aplikasi frontend berjalan di `http://localhost:5173` (atau port yang ditampilkan terminal Vite).

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

1. **Eksplorasi Peta & Informasi Kota**: buka beranda untuk melihat sebaran fasilitas bermasalah di peta interaktif, status gempa bumi BMKG, dan berita terkini.
2. **Kirim Laporan Fasilitas**:
   - Klik tombol **"Buat Laporan"**.
   - Sistem mendeteksi koordinat GPS otomatis (atau tentukan lokasi secara manual).
   - Isi judul, kategori, deskripsi masalah, dan unggah foto bukti kerusakan.
   - Pilih laporan publik atau anonim, lalu klik **Kirim Laporan**.
3. **Lacak Tiket Status**:
   - Buka menu **"Lacak Tiket"** dan masukkan kode tiket (misal: `LP-2026-0001`).
   - Pantau tahapan penanganan (Menunggu Verifikasi, Sedang Dikerjakan, Selesai).
   - Periksa foto perbaikan (After Image) dan catatan resmi dari petugas lapangan.
4. **Beri Ulasan Kepuasan**: setelah laporan berstatus selesai, beri penilaian bintang (1-5) dan saran perbaikan.
5. **Donasi Komunitas**: pilih menu donasi untuk mendukung perbaikan fasilitas mendesak via QRIS atau Virtual Account.

#### Untuk Admin / Operator Dinas

1. **Akses Panel Operator**: klik tombol **"Petugas"** atau **"Mode Operator"** pada navigasi atas.
2. **Autentikasi Biometrik Wajah**: arahkan wajah ke kamera webcam untuk verifikasi lewat Face-API.
3. **Manajemen Tiket Laporan**:
   - Tinjau aduan baru dari masyarakat.
   - Ubah status menjadi **"Diproses"** saat teknisi dikerahkan ke lokasi.
   - Setelah penanganan tuntas, ubah status menjadi **"Selesai"**, cantumkan catatan teknis, dan unggah foto hasil perbaikan (After Image).

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
