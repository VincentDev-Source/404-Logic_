<div align="center">
  
  # 🏙️ CivicPulse - LaporKota
  ### Platform Pelaporan Publik & Manajemen Infrastruktur Kota Berbasis AI Biometrik & Real-Time GIS
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://civicpulse-laporkota.vercel.app)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Arklerknight/404-Logic)
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
| **VincentDev as Malvino** | Project Lead & UX/UI Developer | [@404-Logic](https://github.com/VincentDev-Source) |
| **annafi2 as Arka** | Full Stack Developer | [@Arklerknight](https://github.com/annafi2) |
| **27RamaaaDevRamaaa as Rama - Frontend** | Frontend & Backend Developer | [@404-Logic](https://github.com/27RamaaaDev) |


---

## 🎯 Tentang Proyek

### Latar Belakang

Permasalahan infrastruktur publik di wilayah perkotaan—seperti jalan berlubang, genangan air/banjir, penerangan jalan umum (PJU) mati, hingga penumpukan sampah liar—seringkali terlambat ditangani akibat birokrasi pelaporan manual yang rumit dan tidak transparan. 

Berdasarkan studi pelayanan publik kota, lebih dari **68% warga merasa enggan melaporkan kerusakan publik** karena ketiadaan sistem pelacakan status (*ticket tracking*) yang jelas, serta kekhawatiran laporan mereka diabaikan. Di sisi lain, petugas instansi dinas teknis kewalahan memverifikasi keabsahan laporan, mendeteksi titik koordinat lokasi secara presisi, serta mengelola progres perbaikan di lapangan secara efisien.

### Solusi yang Ditawarkan

**CivicPulse (LaporKota)** hadir sebagai platform *Smart City Civic Engagement* generasi baru yang mengintegrasikan pelaporan masyarakat secara instan dengan manajemen dinas kota secara *real-time*. 

Dengan memanfaatkan **Peta GIS Interaktif (Leaflet)**, **Sistem Geolokasi Presisi (GPS & IP Fallback)**, **Pelacakan Tiket Real-time**, **Autentikasi Biometrik Wajah Operator berbasis AI (*Face Recognition*)**, serta **Dashboard Analitik Kota**, CivicPulse menjembatani warga dan pemerintah kota untuk menciptakan lingkungan perkotaan yang lebih aman, responsif, dan berkelanjutan.

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Mempercepat waktu tanggap (*response time*) perbaikan infrastruktur kota dan meningkatkan transparansi penanganan laporan instansi pemerintah.
- 📊 **Target Pengguna**: Masyarakat umum perkotaan, petugas dinas/operator teknis lapangan, dan pemangku kebijakan (*city planners*).
- 💡 **Value Proposition**: Pelaporan berbasis peta GIS interaktif, sistem pelacakan tiket transparan dengan bukti foto *Before/After*, serta login operator tanpa password berbasis AI Biometrik Wajah (*Passwordless Face Recognition*).

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **Peta GIS Interaktif** | Visualisasi lokasi laporan masalah kota secara *real-time* di peta interaktif Leaflet. | Dilengkapi *custom map marker*, kategori ikon dinamis, serta filter status dan tingkat keparahan. |
| **Pelaporan Presisi & GPS** | Formulir pelaporan fasilitas rusak dengan deteksi koordinat otomatis (GPS/IP fallback) dan unggah foto. | Pengguna dapat mengirim laporan secara instan dengan opsi anonim untuk menjaga privasi. |
| **Pelacakan Tiket Real-Time** | Sistem pelacakan progres laporan menggunakan ID Tiket unik (contoh: `LP-2026-0001`). | Menampilkan lini masa 4 tahap transparan, catatan resmi petugas, serta perbandingan foto *Before/After*. |
| **Autentikasi Biometrik Wajah** | Login & pendaftaran operator dinas menggunakan AI pengenalan wajah (*Face-API*) langsung di browser. | Menggunakan komparasi *128-D Vector Euclidean Distance Matching* tanpa risiko kebocoran kata sandi. |
| **Dashboard Operator Dinas** | Panel khusus petugas untuk verifikasi laporan warga, pembaruan status, dan repositori penanganan. | Memudahkan dinas memproses antrean laporan dari *Menunggu*, *Diproses*, hingga *Selesai*. |
| **Analytics & Data Kota** | Panel visualisasi statistik kota berbasis **Recharts** untuk analisis kinerja dan tren kerusakan. | Menyajikan grafik tren mingguan, persentase penyelesaian, waktu tanggap rata-rata, dan distribusi kategori. |

### Fitur Tambahan

- **Peringatan Dini Gempa Bumi BMKG** - Real-time integration API BMKG untuk pemantauan data gempa bumi terkini, magnitudo, kedalaman, dan peta potensi bencana.
- **Widget Berita Kota (City News)** - Agregator berita terintegrasi untuk informasi infrastruktur, penanggulangan bencana, dan cuaca terkini di kota pengguna.
- **Sistem Rating & Ulasan Kepuasan** - Warga dapat memberikan ulasan bintang (1-5) dan umpan balik atas hasil pengerjaan petugas setelah tiket diselesaikan.
- **Micro-Animations & Confetti** - Efek visual perayaan (*canvas-confetti*) dan transisi animasi halus (*Framer Motion*) untuk meningkatkan keterlibatan pengguna (*UX*).

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website CivicPulse](https://civicpulse-laporkota.vercel.app)**

### Screenshot Aplikasi

<div align="center">
  <img src="https://raw.githubusercontent.com/Arklerknight/404-Logic/main/public/screenshots/homepage.png" alt="Homepage CivicPulse" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/6366f1?text=CivicPulse+Homepage+Interactive+Map'"/>
  <p><em>Homepage - Tampilan utama aplikasi dengan Peta Interaktif & Stats Overview</em></p>
  
  <img src="https://raw.githubusercontent.com/Arklerknight/404-Logic/main/public/screenshots/operator-dashboard.png" alt="Dashboard Operator" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/6366f1?text=Operator+Dashboard+%26+Face+Auth'"/>
  <p><em>Dashboard Operator - Panel kontrol petugas dinas & verifikasi laporan</em></p>
  
  <img src="https://raw.githubusercontent.com/Arklerknight/404-Logic/main/public/screenshots/ticket-tracker.png" alt="Ticket Tracker & Biometrics" width="800" onerror="this.src='https://placehold.co/800x450/0f172a/6366f1?text=Ticket+Tracker+%26+Biometric+Face+Auth'"/>
  <p><em>Pelacakan Tiket & Autentikasi Biometrik Wajah Operator</em></p>
</div>

### Video Demo

📹 **[Tonton Video Demonstrasi Aplikasi](https://youtube.com)** _(Video walkthrough aplikasi CivicPulse)_

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend
```
Framework    : React 18 (Vite 6 Bundler)
UI Library   : Tailwind CSS v3, Lucide React Icons, Framer Motion
State Mgmt   : React Hooks (Context API & Custom Hooks)
Map Library  : Leaflet.js & React-Leaflet
Charts       : Recharts
AI Biometrics: @vladmandic/face-api (TensorFlow.js edge execution)
```

#### Backend
```
Runtime      : Node.js (Vercel Serverless Functions)
Framework    : Serverless API Handlers
Database     : PostgreSQL (Vercel Postgres / Supabase)
ORM          : Prisma ORM v6 (@prisma/client)
Auth         : AI Biometric Vector Matching (128-D Euclidean Distance)
```

#### DevOps & Tools
```
Deployment   : Vercel Cloud Platform
CI/CD        : Vercel Automatic Git Deployment
Linting      : ESLint & PostCSS
External APIs: BMKG Open Data API, GNews API / RSS News Aggregator
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **React 18 + Vite** | Memberikan performa render yang cepat, struktur komponen modular, serta *Hot Module Replacement (HMR)* yang responsif. |
| **Prisma ORM & PostgreSQL** | Menyediakan pengaksesan database ber-tipe data aman (*type-safe*), skema migrasi yang terstruktur, dan performa query relational yang tinggi. |
| **Face-API.js (@vladmandic)** | Memungkinkan deteksi dan pengenalan biometrik wajah langsung di *client-side browser*, mengurangi beban komputasi server. |
| **Leaflet.js** | Library pemetaan berbasis GIS yang sangat ringan, responsif, dan mudah disesuaikan dengan titik koordinat laporan warga. |

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
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture

```mermaid
graph TD
    subgraph Client Layer
        Citizen[Warga / Pelapor] -->|Akses Web SPA| ReactApp[React + Vite Frontend]
        Operator[Petugas / Operator Dinas] -->|Face Auth AI| ReactApp
    end

    subgraph External Services
        ReactApp -->|Fetch Data Gempa| BMKG[BMKG Disaster API]
        ReactApp -->|Fetch News Feed| NewsAPI[City News Aggregator]
    end

    subgraph API & Backend Layer
        ReactApp -->|REST API Requests| VercelAPI[Vercel Serverless Functions]
        VercelAPI -->|Public Reports CRUD| API_Reports[/api/reports]
        VercelAPI -->|Operator Actions| API_Operator[/api/operator/reports]
        VercelAPI -->|Biometric Match| API_FaceAuth[/api/auth/face-login]
    end

    subgraph Database Layer
        API_Reports --> Prisma[Prisma ORM]
        API_Operator --> Prisma
        API_FaceAuth --> Prisma
        Prisma --> PostgresDB[(PostgreSQL Database)]
    end
```

### Database Schema

Skema basis data dikelola menggunakan **Prisma ORM** dengan model utama:

```prisma
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
```

### Folder Structure

```
404-Logic-main/
├── api/                       # Vercel Serverless Functions API Endpoints
│   ├── auth/                  # API Autentikasi Biometrik Wajah
│   │   ├── face-login.js      # Verifikasi vektor 128-D wajah
│   │   └── face-register.js   # Pendaftaran deskriptor wajah operator
│   ├── operator/              # API Khusus Dashboard Operator
│   │   └── reports.js         # Update status & upload dokumentasi perbaikan
│   ├── earthquake.js          # Fetcher data gempa bumi BMKG
│   ├── news.js                # Aggregator berita publik kota
│   └── reports.js             # CRUD laporan warga & upvote/rating
├── prisma/                    # Konfigurasi & Schema Prisma ORM
│   └── schema.prisma          # Model Database PostgreSQL
├── public/                    # Static Assets
│   └── models/                # Bobot Neural Network Face-API (.json & .bin)
├── src/                       # Source Code Aplikasi React
│   ├── components/            # Komponen UI Reusable
│   │   ├── AnalyticsDashboard.jsx  # Visualisasi grafik statistik kota
│   │   ├── CityNewsWidget.jsx      # Widget portal berita kota
│   │   ├── CreateReportModal.jsx   # Form dialog pelaporan fasilitas
│   │   ├── EarthquakeAlert.jsx     # Banner peringatan dini gempa
│   │   ├── FaceAuth.jsx            # Modal login biometrik operator
│   │   ├── FaceAuthOperator.jsx    # Fitur pemindaian wajah kamera live
│   │   ├── InteractiveMap.jsx      # Integrasi Peta Leaflet & Markers
│   │   ├── Navbar.jsx              # Bilah navigasi utama
│   │   ├── OperatorDashboard.jsx   # Panel manajemen dinas teknis
│   │   ├── ReportFeed.jsx          # Feed daftar & filter laporan
│   │   └── TicketTrackerModal.jsx  # Modal pelacakan tiket status
│   ├── lib/                   # Utility Libraries
│   │   └── prisma.js          # Prisma Client Singleton Instance
│   ├── utils/                 # Helper Functions
│   │   └── geolocation.js     # IP & Browser Geolocation Handler
│   ├── App.jsx                # Komponen Utama & Manajemen State App
│   ├── index.css              # Style Tailwind CSS & Custom Animation
│   └── main.jsx               # Entry Point React DOM
├── .env                       # Environment Variables Configuration
├── package.json               # Project Dependencies & Scripts
├── tailwind.config.js         # Konfigurasi Styling Tailwind
└── vite.config.js             # Konfigurasi Vite Bundler
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan perangkat Anda telah terpasang:
- **Node.js** (v18.x atau versi LTS terbaru)
- **npm** (v9.x atau lebih tinggi) atau **yarn** / **pnpm**
- **PostgreSQL Database** (Lokal atau Cloud seperti Supabase / Vercel Postgres)
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Arklerknight/404-Logic.git
cd 404-Logic
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

Buat file `.env` di direktori utama (*root directory*):

```env
# PostgreSQL Database URL
POSTGRES_PRISMA_DATABASE_URL="postgresql://user:password@localhost:5432/civicpulse?schema=public"

# Optional News API Key (Jika tidak diisi, menggunakan fallback Google News RSS)
GNEWS_API_KEY="your_gnews_api_key_here"

# App Node Environment
NODE_ENV="development"
```

#### 4️⃣ Setup Database & Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi basis data
npx prisma db push
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan secara lokal di `http://localhost:5173` (atau port yang ditentukan Vite).

---

## 🚀 Penggunaan

### Menjalankan Aplikasi

```bash
# Jalankan mode pengembangan (Development)
npm run dev

# Build untuk produksi (Production)
npm run build

# Preview build produksi
npm run preview

# Linting kode
npm run lint
```

### User Guide

#### Untuk Warga (Masyarakat Umum)

1. **Eksplorasi Peta & Laporan**: Buka halaman utama untuk melihat titik-titik lokasi fasilitas rusak yang dilaporkan di peta interaktif.
2. **Buat Laporan Baru**: Klik tombol **"Buat Laporan"**, pilih lokasi otomatis via GPS atau input manual, unggah foto bukti, tulis deskripsi masalah, lalu kirim.
3. **Lacak Tiket**: Gunakan ID Tiket yang didapatkan (misal: `LP-2026-0001`) pada menu **"Lacak Tiket"** untuk memantau status penanganan secara real-time.
4. **Beri Ulasan Kepuasan**: Setelah laporan berstatus *Selesai*, warga dapat memberikan ulasan bintang (1-5) dan masukan untuk petugas.

#### Untuk Operator / Petugas Dinas

1. **Akses Login Operator**: Klik tombol **"Mode Operator"** di bilah navigasi.
2. **Autentikasi Biometrik Wajah**: Arahkan wajah ke kamera untuk melakukan pemindaian biometrik AI secara instan.
3. **Verifikasi & Update Status**: Pada Dashboard Operator, petugas dapat menyetujui laporan, mengubah status menjadi *Diproses* atau *Selesai*, mengunggah foto bukti perbaikan (*After Image*), serta memberikan catatan teknis.

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5173/api (atau via Vercel CLI http://localhost:3000/api)
Production:  https://civicpulse-laporkota.vercel.app/api
```

### Endpoints

#### Autentikasi Biometrik Operator

```http
POST /api/auth/face-login       # Verifikasi login operator dengan vector pemindaian wajah
POST /api/auth/face-register    # Mendaftarkan deskriptor biometrik wajah operator baru
```

#### Laporan Publik (Reports)

```http
GET    /api/reports             # Mendapatkan seluruh daftar laporan publik
POST   /api/reports             # Membuat laporan publik baru
PUT    /api/reports             # Memperbarui upvote, rating, atau status laporan
DELETE /api/reports             # Menghapus laporan publik (Khusus Admin)
```

#### Dashboard Operator

```http
GET    /api/operator/reports    # Mendapatkan daftar laporan khusus panel operator
PATCH  /api/operator/reports    # Memperbarui status penanganan, foto perbaikan & catatan
```

#### Layanan Eksternal & Bencana

```http
GET    /api/earthquake          # Mengambil data gempa bumi terkini dari BMKG
GET    /api/news?city=Jakarta   # Mengambil agregat berita kota & mitigasi bencana
```

### Example Request

```javascript
// Contoh Pembuatan Laporan Baru
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Jalan Berlubang Parah di Jl. Sudirman',
    category: 'Jalan & Jembatan',
    description: 'Terdapat lubang sedalam 15cm yang membahayakan pengendara motor.',
    location: 'Jl. Jend. Sudirman No. 45 (GPS: -6.2088, 106.8456)',
    imageUrl: 'https://example.com/foto-bukti.jpg'
  })
});

const data = await response.json();
console.log('Laporan Terbuat:', data);
```

---

## 🧪 Testing

### Running Tests & Validation

```bash
# Jalankan pengecekan TypeScript & Syntax Linting
npm run lint

# Verifikasi skema database Prisma
npx prisma validate
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

  **Made with ❤️ by 404 Logic for ITECHNO CUP 2026**

</div>
