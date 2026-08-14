# URBANPULSE

URBANPULSE adalah fondasi platform city intelligence berbasis Laravel untuk menghubungkan data kota, laporan warga, analisis, insight, dan tindakan. Repository ini masih berada pada **STEP 3 / Phase 1 Foundation**; tampilan dashboard yang memakai angka simulasi selalu ditandai **Demo Dataset**.

## Scope Foundation saat ini

Sudah tersedia:

- schema domain inti untuk wilayah, sumber data, definisi metric, observasi metric, fasilitas, cuaca, kualitas udara, laporan warga, City Score snapshot, dan AI Insight snapshot;
- autentikasi session Laravel, verifikasi email, dan role `citizen`, `officer`, serta `admin`;
- workflow laporan persisten: buat, moderasi proyeksi publik, lacak, konfirmasi idempoten, dan transisi status oleh petugas;
- policy, Form Request validation, rate limiting, resource JSON aman, demo seeder opt-in, serta test Foundation.

Belum diimplementasikan pada phase ini: kalkulasi City Score/Priority, GIS/PostGIS, upload bukti, ingestion API eksternal, analytics, queue domain, AI provider, dan administration UI. File konfigurasi City Score/Priority hanya menjadi kontrak terpusat; belum menghasilkan skor.

## Kebutuhan lokal

- PHP **8.4.1+**. `composer.json` masih mengizinkan PHP 8.3, tetapi paket Symfony yang terkunci saat ini membutuhkan PHP 8.4.1+.
- Composer 2.x.
- Node.js `^20.19.0` atau `>=22.12.0` sesuai Vite 8.
- SQLite dan extension PHP `pdo_sqlite`; extension umum Laravel seperti OpenSSL, Fileinfo, XML, dan Tokenizer juga harus aktif.

Foundation menggunakan SQLite dan tipe data portabel. PostGIS belum digunakan karena runtime saat ini tidak memiliki `pdo_pgsql`.

## Instalasi

PowerShell:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
if (-not (Test-Path database/database.sqlite)) { New-Item -ItemType File database/database.sqlite }
php artisan migrate
npm ci --ignore-scripts
npm run build
```

Untuk memuat data simulasi lomba, pastikan `.env` memuat:

```dotenv
URBANPULSE_DEMO_MODE=true
URBANPULSE_SEED_DEMO=true
```

Kemudian jalankan:

```powershell
php artisan db:seed
```

Seeder demo bersifat idempoten dan memakai email domain `.test` dengan password acak yang tidak dipublikasikan. Tidak ada akun demo dengan kredensial bawaan. Pada environment non-demo, set `URBANPULSE_SEED_DEMO=false`.

## Menjalankan aplikasi

```powershell
composer run dev
```

Atau jalankan server dan Vite secara terpisah:

```powershell
php artisan serve
npm run dev
```

Cache, session, dan queue default memakai database. Ini sesuai untuk demo satu worker, bukan beban konkurensi tinggi. Phase Foundation belum menjadwalkan job domain.

## Halaman publik

- `/` — Dashboard Kota
- `/city-intelligence` — City Intelligence
- `/mobilitas` — Mobilitas Kota
- `/lingkungan` — Lingkungan Kota
- `/laporan-warga` — Laporan Warga

URL lama `/layanan` dan `/komunitas` tetap tersedia sebagai redirect sementara ke halaman canonical. Halaman publik hanya menampilkan snapshot database yang memiliki provenance; kemampuan yang belum dibangun ditampilkan sebagai status kosong, bukan simulasi interaksi.

## Endpoint Foundation

Semua endpoint JSON saat ini berada di middleware stack `web` agar autentikasi session dan CSRF tetap konsisten:

- `GET /api/reports` — hanya laporan yang sudah dimoderasi
- `POST /api/reports` — pengguna aktif
- `GET /api/reports/{tracking_code}` — publik dengan lokasi sensitif disembunyikan
- `POST /api/reports/{tracking_code}/confirm` — citizen aktif dan terverifikasi selain pelapor
- `PATCH /api/reports/{tracking_code}/status` — officer/admin

`POST /api/layanan/ajukan` sengaja tetap non-persisten dan mengembalikan `501` sampai kontrak data pribadi layanan publik disetujui.

## Data dan privasi

- Timestamp disimpan dalam UTC dan dikonversi ke `Asia/Jakarta` hanya saat presentasi.
- Laporan berstatus `submitted`/`rejected` tidak masuk feed publik dan hanya dapat dibuka oleh pelapor atau officer/admin aktif.
- Judul/deskripsi asli tetap privat; feed memakai `public_title` dan `public_summary` yang wajib disunting petugas saat verifikasi.
- Koordinat dan lokasi rinci laporan non-demo hanya dikembalikan kepada pelapor atau officer/admin aktif.
- Data demo memiliki provenance dan label `is_demo`; data tersebut bukan data pemerintah ataupun kondisi kota real-time.
- API key eksternal nantinya wajib berasal dari `.env`, tidak dari source code atau frontend.

## Verifikasi

```powershell
composer validate --strict
composer check-platform-reqs
vendor\bin\pint --test
php artisan test
php artisan route:list -v
npm run build
git diff --check
```

Untuk smoke test schema di database disposable, gunakan file SQLite sementara; jangan menjalankan `migrate:fresh` pada database yang menyimpan data penting.

## Langkah berikutnya

Setelah Foundation disetujui, lanjutkan Phase 2 secara bertahap: query City Overview, agregasi metric tervalidasi, lalu kalkulasi City Score yang versioned dan auditable. Jangan mengaktifkan skor sebelum normalization rules dan sumber benchmark disetujui.
