<header id="main-header" class="civic-header">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="civic-header__inner">
            <div class="civic-brand-cluster">
                <a href="{{ route('home') }}" class="civic-brand" aria-label="URBANPULSE Dashboard">
                    <span class="civic-brand__mark">
                        <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M5 26V14l7-5v17M12 26V6l8 5v15M20 26V15l7-4v15M3 26h26"/></svg>
                    </span>
                    <span class="civic-brand__name">
                        <strong>URBANPULSE</strong>
                        <small>City Intelligence</small>
                    </span>
                </a>
            </div>

            <nav class="civic-nav" aria-label="Navigasi Utama">
                <a href="{{ route('home') }}" @class(['is-active' => request()->routeIs('home')]) @if (request()->routeIs('home')) aria-current="page" @endif>Dashboard</a>
                <a href="{{ route('city-intelligence') }}" @class(['is-active' => request()->routeIs('city-intelligence')]) @if (request()->routeIs('city-intelligence')) aria-current="page" @endif>City Intelligence</a>
                <a href="{{ route('mobilitas') }}" @class(['is-active' => request()->routeIs('mobilitas')]) @if (request()->routeIs('mobilitas')) aria-current="page" @endif>Mobilitas</a>
                <a href="{{ route('lingkungan') }}" @class(['is-active' => request()->routeIs('lingkungan')]) @if (request()->routeIs('lingkungan')) aria-current="page" @endif>Lingkungan</a>
                <a href="{{ route('laporan-warga') }}" @class(['is-active' => request()->routeIs('laporan-warga')]) @if (request()->routeIs('laporan-warga')) aria-current="page" @endif>Laporan Warga</a>
            </nav>

            <div class="civic-header__actions">
                @auth
                    <button type="button" data-modal-target="modal-lapor" class="header-report-button" aria-label="Buat laporan warga" aria-haspopup="dialog" aria-controls="modal-lapor">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                        <span class="hidden sm:inline">Buat laporan</span><span class="sm:hidden">Lapor</span>
                    </button>
                    <button type="button" data-modal-target="modal-account" class="header-account-button" aria-label="Buka menu akun {{ auth()->user()->name }}" aria-haspopup="dialog" aria-controls="modal-account">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>
                    </button>
                @else
                    <a href="{{ route('login') }}" class="header-report-button header-login-button">Masuk</a>
                @endauth
                <button type="button" class="mobile-menu-button" data-mobile-menu-toggle aria-expanded="false" aria-controls="mobile-primary-navigation" aria-label="Buka menu navigasi">
                    <svg class="mobile-menu-button__open" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                    <svg class="mobile-menu-button__close" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
                </button>
            </div>
        </div>

        <nav id="mobile-primary-navigation" class="mobile-nav-panel" data-mobile-menu hidden aria-label="Navigasi Utama Seluler">
            <div class="mobile-nav-panel__grid">
                <a href="{{ route('home') }}" @class(['is-active' => request()->routeIs('home')]) @if (request()->routeIs('home')) aria-current="page" @endif>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 9-7 9 7v9h-6v-6H9v6H3z"/></svg>
                    <span><strong>Dashboard</strong><small>Ringkasan kondisi kota</small></span>
                </a>
                <a href="{{ route('city-intelligence') }}" @class(['is-active' => request()->routeIs('city-intelligence')]) @if (request()->routeIs('city-intelligence')) aria-current="page" @endif>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3M3 19h18"/></svg>
                    <span><strong>City Intelligence</strong><small>Kesiapan data dan analisis</small></span>
                </a>
                <a href="{{ route('mobilitas') }}" @class(['is-active' => request()->routeIs('mobilitas')]) @if (request()->routeIs('mobilitas')) aria-current="page" @endif>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 17h14M7 17v2m10-2v2M6 5h12l1 8H5z"/></svg>
                    <span><strong>Mobilitas</strong><small>Pergerakan dan transportasi</small></span>
                </a>
                <a href="{{ route('lingkungan') }}" @class(['is-active' => request()->routeIs('lingkungan')]) @if (request()->routeIs('lingkungan')) aria-current="page" @endif>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21V9m0 7c-5 0-8-3-8-8 5 0 8 3 8 8Zm0-3c0-5 3-8 8-8 0 5-3 8-8 8Z"/></svg>
                    <span><strong>Lingkungan</strong><small>Kualitas udara dan cuaca</small></span>
                </a>
                <a href="{{ route('laporan-warga') }}" @class(['is-active' => request()->routeIs('laporan-warga')]) @if (request()->routeIs('laporan-warga')) aria-current="page" @endif>
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 12h8M8 8h8M5 4h14v14h-7l-4 3v-3H5z"/></svg>
                    <span><strong>Laporan Warga</strong><small>Pantau isu dan tindak lanjut</small></span>
                </a>
            </div>

            <div class="mobile-nav-panel__footer">
                @auth
                    <button type="button" data-modal-target="modal-account" data-mobile-menu-action class="mobile-nav-account" aria-haspopup="dialog" aria-controls="modal-account">
                        <span class="mobile-nav-account__icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg></span>
                        <span><strong>{{ auth()->user()->name }}</strong><small>Kelola akun{{ auth()->user()->hasVerifiedEmail() ? '' : ' · Email belum diverifikasi' }}</small></span>
                        <svg class="mobile-nav-account__arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                @else
                    <div class="mobile-nav-guest">
                        <div class="mobile-nav-guest__copy">
                            <strong>Akses warga</strong>
                            <small>Buat dan pantau laporan kota Anda.</small>
                        </div>
                        <div class="mobile-nav-auth-actions">
                            <a href="{{ route('login') }}" class="mobile-nav-login">Masuk</a>
                            <a href="{{ route('register') }}" class="mobile-nav-register">Buat akun</a>
                        </div>
                    </div>
                @endauth
            </div>
        </nav>
    </div>
</header>
