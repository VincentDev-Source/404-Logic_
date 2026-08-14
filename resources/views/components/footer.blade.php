<footer class="civic-footer" role="contentinfo">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="civic-footer__top">
            <div class="civic-footer__brand">
                <a href="{{ route('home') }}" class="civic-brand civic-brand--footer" aria-label="URBANPULSE Dashboard">
                    <span class="civic-brand__mark"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M5 26V14l7-5v17M12 26V6l8 5v15M20 26V15l7-4v15M3 26h26"/></svg></span>
                    <span class="civic-brand__name"><strong>URBANPULSE</strong><small>City Intelligence</small></span>
                </a>
                <p>Platform untuk menelusuri data kota, memahami kesiapan analisis, dan menghubungkan sinyal warga dengan tindakan.</p>
            </div>

            <div>
                <h2>Platform</h2>
                <ul>
                    <li><a href="{{ route('home') }}">Dashboard Kota</a></li>
                    <li><a href="{{ route('city-intelligence') }}">City Intelligence</a></li>
                    <li><a href="{{ route('mobilitas') }}">Mobilitas Kota</a></li>
                    <li><a href="{{ route('lingkungan') }}">Lingkungan Kota</a></li>
                </ul>
            </div>

            <div>
                <h2>Partisipasi</h2>
                <ul>
                    <li><a href="{{ route('laporan-warga') }}">Laporan Warga</a></li>
                    @guest<li><a href="{{ route('login') }}">Masuk</a></li>@endguest
                    @guest<li><a href="{{ route('register') }}">Daftar akun warga</a></li>@endguest
                    <li><button type="button" data-modal-target="modal-keyboard-shortcuts">Panduan keyboard</button></li>
                </ul>
            </div>

        </div>

        <div class="civic-footer__bottom">
            <p>© 2026 404-Logic · URBANPULSE.</p>
            <p>Lokasi rinci laporan dilindungi · Timestamp disimpan dalam UTC</p>
        </div>
    </div>
</footer>
