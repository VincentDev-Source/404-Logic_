<!-- 1. MODAL LAPOR WARGA -->
<div id="modal-lapor" class="modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 hidden" aria-hidden="true" aria-modal="true" role="dialog" aria-labelledby="modal-lapor-title">
    <div class="modal-panel bg-white max-w-lg w-full p-6 sm:p-8 border border-slate-100 relative">
        <button type="button" data-modal-close class="absolute top-6 right-6 p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none" aria-label="Tutup Dialog">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="mb-6">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">Partisipasi Warga</span>
            <h2 id="modal-lapor-title" class="text-2xl font-extrabold text-slate-900 mt-2">Buat Laporan Kendala Kota</h2>
            <p class="text-xs text-slate-500 mt-1">Sampaikan laporan infrastruktur, kebersihan, atau fasilitas umum untuk ditindaklanjuti dinas terkait.</p>
        </div>

        @auth
            <form id="form-lapor-warga" action="{{ route('api.reports.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label for="lapor-category" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kategori Laporan <span class="text-red-500">*</span></label>
                    <select id="lapor-category" name="category" required class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20">
                        <option value="">-- Pilih Kategori --</option>
                        <option value="environment">Lingkungan</option>
                        <option value="mobility">Mobilitas</option>
                        <option value="infrastructure">Infrastruktur</option>
                        <option value="public_services">Layanan Publik</option>
                        <option value="other">Lainnya</option>
                    </select>
                </div>

                <div>
                    <label for="lapor-title" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Judul Laporan Singkat <span class="text-red-500">*</span></label>
                    <input type="text" id="lapor-title" name="title" maxlength="160" required placeholder="Contoh: Lampu Jalan Padam di RT 03" class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-600">
                </div>

                <div>
                    <label for="lapor-address" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Lokasi Kejadian <span class="text-red-500">*</span></label>
                    <input type="text" id="lapor-address" name="address" maxlength="255" required placeholder="Nama jalan, area, atau landmark; hindari alamat rumah lengkap" class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-600">
                </div>

                <div>
                    <label for="lapor-description" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Lengkap <span class="text-red-500">*</span></label>
                    <textarea id="lapor-description" name="description" rows="3" minlength="10" maxlength="3000" required placeholder="Jelaskan kondisi detail kendala agar petugas dapat menindaklanjuti secara akurat." class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-600"></textarea>
                </div>

                <p class="text-xs leading-relaxed text-slate-500">Judul dan deskripsi dapat dipublikasikan setelah verifikasi petugas. Hindari data pribadi; nama akun, alamat rinci, dan koordinat presisi tidak ditampilkan pada umpan publik.</p>

                <div class="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button type="button" data-modal-close class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100">Batal</button>
                    <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all">Kirim Laporan Warga</button>
                </div>
            </form>
        @else
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p class="text-sm font-bold text-amber-950">Masuk diperlukan</p>
                <p class="mt-1 text-sm text-amber-800">Autentikasi melindungi tracking laporan dan mencegah spam konfirmasi.</p>
                <a href="{{ route('login') }}" class="button button--signal mt-4 w-full">Masuk untuk melapor</a>
            </div>
        @endauth
    </div>
</div>

<div id="modal-report-success" class="modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 hidden" aria-hidden="true" aria-modal="true" role="dialog" aria-labelledby="modal-report-success-title">
    <div class="modal-panel bg-white max-w-md w-full p-6 sm:p-8 border border-slate-100 relative">
        <button type="button" data-modal-close class="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="Tutup Dialog">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="success-mark" aria-hidden="true">✓</div>
        <p class="mt-5 text-xs font-bold text-emerald-700">Laporan tersimpan</p>
        <h2 id="modal-report-success-title" class="mt-2 pr-8 text-2xl font-extrabold text-slate-950">Simpan tracking code ini</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">Laporan menunggu moderasi dan belum tampil di feed publik.</p>
        <div class="tracking-code-box mt-6">
            <code data-new-report-code>UP-</code>
            <button type="button" data-copy-report-code>Salin kode</button>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <a href="{{ route('laporan-warga') }}#tracking" data-modal-close data-track-new-report class="button button--signal">Lacak laporan</a>
            <button type="button" data-modal-close class="button button--outline">Tutup</button>
        </div>
    </div>
</div>

@auth
    <div id="modal-account" class="modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 hidden" aria-hidden="true" aria-modal="true" role="dialog" aria-labelledby="modal-account-title">
        <div class="modal-panel bg-white max-w-sm w-full p-6 border border-slate-100 relative">
            <button type="button" data-modal-close class="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="Tutup Dialog">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <p class="text-xs font-bold text-emerald-700">Akun URBANPULSE</p>
            <h2 id="modal-account-title" class="mt-2 pr-10 text-2xl font-extrabold text-slate-950">{{ auth()->user()->name }}</h2>
            <p class="mt-1 break-all text-sm text-slate-500">{{ auth()->user()->email }}</p>
            <div class="mt-6 grid gap-3">
                @if (! auth()->user()->hasVerifiedEmail())
                    <a href="{{ route('verification.notice') }}" class="button button--signal w-full">Verifikasi email</a>
                @endif
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="button button--outline w-full">Keluar dari akun</button>
                </form>
            </div>
        </div>
    </div>
@endauth

<!-- 2. MODAL KEYBOARD SHORTCUTS -->
<div id="modal-keyboard-shortcuts" class="modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 hidden" aria-hidden="true" aria-modal="true" role="dialog" aria-labelledby="modal-kbd-title">
    <div class="modal-panel bg-white max-w-md w-full p-6 sm:p-8 border border-slate-100 relative">
        <button type="button" data-modal-close class="absolute top-6 right-6 p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none" aria-label="Tutup Dialog">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="mb-5">
            <span class="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">Aksesibilitas Keyboard</span>
            <h2 id="modal-kbd-title" class="text-xl font-extrabold text-slate-900 mt-2">Pintasan Tombol Cepat</h2>
            <p class="text-xs text-slate-500 mt-1">Navigasi tanpa mouse menggunakan tombol keyboard standar.</p>
        </div>

        <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-medium text-slate-700">Buka Modal Pintasan Ini</span>
                <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">?</kbd>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-medium text-slate-700">Tutup Dialog / Modal Aktif</span>
                <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">Esc</kbd>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-medium text-slate-700">Pindah Antar Elemen Interaktif</span>
                <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">Tab</kbd>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-medium text-slate-700">Lompati Langsung ke Konten Utama</span>
                <kbd class="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-xs">Tab ke-1</kbd>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 text-center">
            <button type="button" data-modal-close class="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs">
                Mengerti (Tutup)
            </button>
        </div>
    </div>
</div>
