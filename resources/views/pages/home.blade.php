@extends('layouts.app')

@section('title', 'Dashboard Kota | URBANPULSE')
@section('meta_description', 'Dashboard URBANPULSE menampilkan snapshot data kota, kesiapan analisis, dan laporan warga dengan provenance yang jelas.')

@section('content')
<section class="city-hero">
    <div class="city-hero__glow" aria-hidden="true"></div>
    <div class="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">

        <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div class="py-10 lg:col-span-7 lg:py-16">
                <p class="city-kicker">URBANPULSE / Dashboard Kota</p>
                <h1 class="city-hero__title">Satu pandangan untuk <span>memahami kondisi kota.</span></h1>
                <p class="city-hero__lead">Satukan metric lintas domain, sinyal laporan warga, dan status kesiapan analisis dalam tampilan yang dapat ditelusuri sumbernya.</p>

                <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="{{ route('city-intelligence') }}" class="button button--signal">Jelajahi City Intelligence</a>
                    <a href="{{ route('laporan-warga') }}" class="button button--ghost-light">Buka Laporan Warga</a>
                </div>

            </div>

            <div class="pb-10 lg:col-span-5 lg:py-12">
                <div class="city-console" data-reveal>
                    <div class="city-console__header">
                        <div><p>Snapshot terpilih</p><h2>{{ $snapshot['region']?->name ?? 'Wilayah belum tersedia' }}</h2></div>
                    </div>

                    <dl class="city-console__metrics">
                        <div><dt>Observasi</dt><dd>{{ $snapshot['metric_count'] }}</dd><span>quality: validated</span></div>
                        <div><dt>Laporan publik</dt><dd>{{ $reportSummary['total'] }}</dd><span>{{ $reportSummary['in_progress'] }} sedang diproses</span></div>
                        <div><dt>Konfirmasi</dt><dd>{{ $reportSummary['confirmations'] }}</dd><span>dari akun terverifikasi</span></div>
                    </dl>

                    <form data-report-tracking-form class="city-ticket-form">
                        <label for="dashboard-tracking-code">Lacak laporan warga</label>
                        <div>
                            <input data-report-tracking-input type="text" id="dashboard-tracking-code" placeholder="Contoh: UP-2026-..." autocomplete="off">
                            <button type="submit">Cek status</button>
                        </div>
                        <div data-report-tracking-result class="mt-4 hidden" role="status" aria-live="polite"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

@if ($snapshot['metrics']->isNotEmpty())
    <section class="signal-rail" aria-label="Ringkasan metric tervalidasi">
        <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
            <div class="signal-rail__track">
                <div class="signal-rail__intro">
                    <strong>Pulse kota</strong>
                    <span>{{ $snapshot['latest_observed_at']?->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i') }} WIB</span>
                </div>
                @foreach ($snapshot['metrics'] as $metric)
                    @php
                        $value = (float) $metric->value;
                        $formattedValue = number_format($value, abs($value - round($value)) < 0.000001 ? 0 : 1, ',', '.');
                    @endphp
                    <div class="signal-rail__item">
                        <span>{{ $metric->definition->category->label() }}</span>
                        <strong>{{ $formattedValue }} <small>{{ $metric->unit }}</small></strong>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
@endif

<section class="city-section" aria-labelledby="snapshot-title">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="section-heading" data-reveal>
            <p class="section-heading__kicker">Snapshot lintas domain</p>
            <h2 id="snapshot-title" class="section-heading__title">Baca sinyal kota dari satu kanvas.</h2>
            <p class="section-heading__desc">Setiap metric membawa unit, wilayah, waktu observasi, dan sumber agar konteksnya tetap dapat ditelusuri.</p>
        </div>

        @if ($snapshot['metrics']->isNotEmpty())
            <div class="domain-grid" data-reveal-stagger>
                @foreach ($snapshot['metrics'] as $metric)
                    <x-city-metric-card :metric="$metric" class="domain-grid__item-{{ $loop->iteration }}" />
                @endforeach
            </div>
        @else
            <div class="card card--placeholder p-10 text-center" data-reveal>
                <h3 class="font-extrabold text-slate-900">Belum ada metric tervalidasi</h3>
                <p class="mt-2 text-sm text-slate-500">Aktifkan sumber data untuk mengisi snapshot kota.</p>
            </div>
        @endif
    </div>
</section>

<section class="decision-section" aria-labelledby="flow-title">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="section-heading section-heading--dark" data-reveal>
            <p class="section-heading__kicker">Alur keputusan</p>
            <h2 id="flow-title" class="section-heading__title">Dari data menuju tindakan.</h2>
            <p class="section-heading__desc">Status tiap tahap dibuat eksplisit agar kemampuan Foundation tidak terbaca sebagai fitur operasional.</p>
        </div>

        <ol class="pipeline-track" data-reveal-stagger>
            <li class="pipeline-node pipeline-node--active"><span>01</span><strong>Data</strong><em>Aktif</em><p>Metric dan laporan tersimpan dengan provenance.</p></li>
            <li class="pipeline-node pipeline-node--ready"><span>02</span><strong>Analisis</strong><em>Fondasi siap</em><p>Schema tersedia. Kalkulasi belum dijalankan.</p></li>
            <li class="pipeline-node"><span>03</span><strong>Insight</strong><em>Belum aktif</em><p>AI menunggu aggregator dan validator.</p></li>
            <li class="pipeline-node pipeline-node--action"><span>04</span><strong>Aksi</strong><em>Tersedia</em><p>Warga dapat membuat dan melacak laporan.</p></li>
        </ol>
    </div>
</section>

<section class="issue-section" aria-labelledby="recent-reports-title">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="section-heading" data-reveal>
            <p class="section-heading__kicker">Sinyal warga</p>
            <h2 id="recent-reports-title" class="section-heading__title">Isu yang masuk ke meja kota.</h2>
            <p class="section-heading__desc">Feed hanya memuat proyeksi publik yang telah dimoderasi petugas.</p>
        </div>

        <div class="issue-ledger" data-reveal-stagger>
            @forelse ($recentReports as $report)
                <article class="issue-ledger__row">
                    <div class="issue-ledger__index">0{{ $loop->iteration }}</div>
                    <div class="issue-ledger__main">
                        <div class="issue-ledger__meta">
                            <span>{{ $report->category->label() }}</span>
                            <time datetime="{{ $report->created_at->toIso8601String() }}">{{ $report->created_at->timezone('Asia/Jakarta')->translatedFormat('d M Y') }}</time>
                        </div>
                        <h3>{{ $report->public_title }}</h3>
                        <p>{{ $report->public_summary }}</p>
                    </div>
                    <div class="issue-ledger__status"><strong>{{ $report->status->label() }}</strong><span>{{ $report->confirmations_count }} konfirmasi</span></div>
                </article>
            @empty
                <div class="card card--placeholder p-10 text-center text-sm text-slate-500">Belum ada laporan yang lolos moderasi.</div>
            @endforelse
        </div>
        <a href="{{ route('laporan-warga') }}" class="text-link mt-6 inline-flex">Lihat semua laporan <span aria-hidden="true">→</span></a>
    </div>
</section>

<section class="action-band">
    <div class="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
        <div class="lg:col-span-8">
            <p>Partisipasi warga</p>
            <h2>Temukan masalah di kota?</h2>
            <span>Laporkan kendala dengan aman. Isi asli dan lokasi rinci tetap dilindungi selama moderasi.</span>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
            <button type="button" data-modal-target="modal-lapor" class="button button--ink">Buat laporan</button>
            <a href="{{ route('laporan-warga') }}" class="button button--outline">Pelajari alur</a>
        </div>
    </div>
</section>
@endsection
