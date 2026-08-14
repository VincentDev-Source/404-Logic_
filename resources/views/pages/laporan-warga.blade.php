@extends('layouts.app')

@section('title', 'Laporan Warga | URBANPULSE')
@section('meta_description', 'Laporan Warga URBANPULSE memungkinkan warga membuat laporan, melacak status, dan mengonfirmasi laporan yang telah dimoderasi.')

@section('content')
<section class="page-hero page-hero--reports px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-6xl relative z-10">
        <nav aria-label="Breadcrumb" class="mb-6 text-xs font-semibold">
            <a href="{{ route('home') }}" class="hover:text-emerald-300">Dashboard</a>
            <span class="mx-2 text-slate-500">/</span>
            <span class="text-slate-300">Laporan Warga</span>
        </nav>
        <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-8">
                <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Laporan Warga</h1>
                <p class="page-hero__lead mt-4 max-w-2xl text-base leading-relaxed">Laporkan kendala, lacak status, dan konfirmasi laporan yang sudah dipublikasikan petugas. Lokasi rinci dan isi asli laporan tidak masuk feed publik.</p>
            </div>
            <div class="lg:col-span-4 lg:justify-self-end">
                <button type="button" data-modal-target="modal-lapor" class="button button--signal w-full sm:w-auto">Buat laporan baru</button>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap-sm) 0;">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" data-reveal-stagger>
        <div class="stat-card stat-card--dark">
            <span class="stat-card__label">Laporan publik</span>
            <strong class="stat-card__value">{{ $reportSummary['total'] }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Terverifikasi</span>
            <strong class="stat-card__value">{{ $reportSummary['verified'] }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Diproses</span>
            <strong class="stat-card__value">{{ $reportSummary['in_progress'] }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Selesai</span>
            <strong class="stat-card__value">{{ $reportSummary['resolved'] }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Konfirmasi</span>
            <strong class="stat-card__value">{{ $reportSummary['confirmations'] }}</strong>
        </div>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-12" data-reveal-stagger>
        <div id="tracking" class="card scroll-mt-24 p-6 lg:col-span-7">
            <h2 class="text-xl font-extrabold text-slate-950 font-heading">Lacak laporan dengan tracking code</h2>
            <p class="mt-1 text-sm text-slate-500">Laporan yang belum dipublikasikan hanya dapat dibuka oleh pelapor atau petugas aktif.</p>
            <form data-report-tracking-form class="mt-5">
                <div class="flex flex-col gap-3 sm:flex-row">
                    <label for="citizen-report-tracking" class="sr-only">Tracking code laporan</label>
                    <input data-report-tracking-input id="citizen-report-tracking" type="text" placeholder="UP-2026-..." autocomplete="off" class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all">
                    <button type="submit" class="button button--signal">Cek status</button>
                </div>
                <div data-report-tracking-result class="mt-4 hidden" role="status" aria-live="polite"></div>
            </form>
        </div>
        <aside class="cta-card cta-card--emerald lg:col-span-5 p-6">
            <h2 class="text-xl font-extrabold text-emerald-950 font-heading">Privasi dan moderasi</h2>
            <ul class="mt-4 space-y-3 text-sm leading-relaxed text-emerald-900">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">•</span> Judul dan ringkasan publik disunting petugas.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">•</span> Alamat rinci serta koordinat tetap privat.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">•</span> Konfirmasi memerlukan email terverifikasi.</li>
            </ul>
        </aside>
    </div>
</section>

<section class="border-y border-slate-200 bg-slate-50" style="padding: var(--section-gap) 0;">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <p class="section-heading__kicker" data-reveal>Siklus laporan</p>
        <ol class="mt-6 grid gap-4 md:grid-cols-4" data-reveal-stagger>
            @foreach ([['Dikirim', 'Privat untuk pelapor dan petugas.'], ['Terverifikasi', 'Ringkasan aman dapat dipublikasikan.'], ['Diproses', 'Penanganan sedang berjalan.'], ['Selesai', 'Timeline penanganan ditutup.']] as $index => [$title, $copy])
                <li class="card p-5 relative overflow-hidden group">
                    <span class="font-mono text-xs font-bold text-emerald-700">0{{ $index + 1 }}</span>
                    <h2 class="mt-3 font-extrabold text-slate-900 text-lg">{{ $title }}</h2>
                    <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ $copy }}</p>
                </li>
            @endforeach
        </ol>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;" aria-labelledby="published-reports-title">
    <div class="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end" data-reveal>
        <div>
            <p class="section-heading__kicker">Feed termoderasi</p>
            <h2 id="published-reports-title" class="section-heading__title">Laporan yang dipublikasikan</h2>
            <p class="section-heading__desc">Konfirmasi menunjukkan dukungan akun, bukan verifikasi identitas atau bukti bahwa kejadian pasti benar.</p>
        </div>
        <div class="flex flex-wrap gap-2" aria-label="Filter status laporan">
            <button type="button" data-report-filter="all" class="report-filter is-active" aria-pressed="true">Semua</button>
            <button type="button" data-report-filter="verified" class="report-filter" aria-pressed="false">Terverifikasi</button>
            <button type="button" data-report-filter="in_progress" class="report-filter" aria-pressed="false">Diproses</button>
            <button type="button" data-report-filter="resolved" class="report-filter" aria-pressed="false">Selesai</button>
        </div>
    </div>

    <div id="report-list-container" class="mt-8 grid gap-5 lg:grid-cols-2" data-reveal-stagger>
        @forelse ($reports as $report)
            <article class="card report-card p-6" data-report-status="{{ $report->status->value }}">
                <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span class="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">{{ $report->status->label() }}</span>
                    <span class="rounded-md bg-slate-50 px-2.5 py-1 text-slate-500">{{ $report->category->label() }}</span>
                </div>
                <h3 class="mt-4 text-xl font-extrabold leading-snug text-slate-950 font-heading">{{ $report->public_title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ $report->public_summary }}</p>

                <dl class="mt-5 grid gap-2 border-t border-slate-100 pt-4 text-xs sm:grid-cols-2">
                    <div>
                        <dt class="text-slate-600">Tracking</dt>
                        <dd class="mt-1 font-mono font-bold text-slate-700">{{ $report->tracking_code }}</dd>
                    </div>
                    <div>
                        <dt class="text-slate-600">Wilayah publik</dt>
                        <dd class="mt-1 font-bold text-slate-700">{{ $report->is_demo ? $report->location_text : $report->region->name }}</dd>
                    </div>
                </dl>

                <div class="mt-5 flex items-center justify-between gap-3">
                    <time datetime="{{ $report->created_at->toIso8601String() }}" class="text-xs text-slate-600 font-medium">{{ $report->created_at->timezone('Asia/Jakarta')->translatedFormat('d M Y') }}</time>
                    @can('confirm', $report)
                        <button type="button" data-confirm-report="{{ route('api.reports.confirm', $report) }}" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 active:scale-95 cursor-pointer">
                            <span data-confirmation-count>{{ $report->confirmations_count }} konfirmasi</span>
                        </button>
                    @else
                        <span class="text-xs font-bold text-slate-500">{{ $report->confirmations_count }} konfirmasi</span>
                    @endcan
                </div>
            </article>
        @empty
            <div class="card card--placeholder p-10 text-center lg:col-span-2">
                <h3 class="font-extrabold text-slate-900">Belum ada laporan publik</h3>
                <p class="mt-2 text-sm text-slate-500">Laporan akan muncul setelah melalui moderasi petugas.</p>
            </div>
        @endforelse
        @if ($reports->isNotEmpty())
            <div data-report-filter-empty class="card card--placeholder hidden p-10 text-center lg:col-span-2" role="status">
                <h3 class="font-extrabold text-slate-900">Tidak ada laporan pada status ini</h3>
                <p class="mt-2 text-sm text-slate-500">Pilih filter lain untuk melihat laporan yang dipublikasikan.</p>
            </div>
        @endif
    </div>
</section>
@endsection
