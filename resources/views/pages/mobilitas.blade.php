@extends('layouts.app')

@section('title', 'Mobilitas Kota | URBANPULSE')
@section('meta_description', 'Mobilitas Kota URBANPULSE menampilkan metric mobilitas yang tersedia, provenance data, dan gap telemetry secara jujur.')

@section('content')
<section class="page-hero page-hero--mobility px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-6xl relative z-10">
        <nav aria-label="Breadcrumb" class="mb-6 text-xs font-semibold">
            <a href="{{ route('home') }}" class="hover:text-emerald-300">Dashboard</a>
            <span class="mx-2 text-slate-500">/</span>
            <span class="text-slate-300">Mobilitas Kota</span>
        </nav>
        <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-8">
                <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Mobilitas Kota</h1>
                <p class="page-hero__lead mt-4 max-w-2xl text-base leading-relaxed">Pantau sinyal kendala jalan yang sudah tersedia dan lihat data apa saja yang masih dibutuhkan sebelum URBANPULSE dapat menganalisis arus transportasi.</p>
            </div>
            <div class="card p-5 lg:col-span-4" data-reveal>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-600">Wilayah snapshot</p>
                <strong class="mt-2 block text-xl text-slate-950">{{ $snapshot['region']?->name ?? 'Belum tersedia' }}</strong>
                <p class="mt-1 text-xs text-slate-500">Bukan telemetry mobilitas real-time.</p>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;">
    <div class="grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-5" data-reveal>
            <p class="section-heading__kicker">Metric tersedia</p>
            <h2 class="section-heading__title">Sinyal kendala jalan</h2>
            <p class="section-heading__desc">Foundation saat ini memiliki satu metric mobilitas tervalidasi. Nilai ini menggambarkan jumlah laporan kendala jalan, bukan kepadatan lalu lintas.</p>
        </div>
        <div class="lg:col-span-7" data-reveal-stagger>
            @forelse ($snapshot['metrics'] as $metric)
                <x-city-metric-card :metric="$metric" class="max-w-xl" />
            @empty
                <div class="card card--placeholder p-10 text-center">
                    <h3 class="font-extrabold text-slate-900">Metric mobilitas belum tersedia</h3>
                    <p class="mt-2 text-sm text-slate-500">Tambahkan sumber mobilitas dan validasi observasinya.</p>
                </div>
            @endforelse
        </div>
    </div>
</section>

<section class="border-y border-slate-200 bg-slate-50" style="padding: var(--section-gap) 0;">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="max-w-2xl" data-reveal>
            <p class="section-heading__kicker">Data readiness</p>
            <h2 class="section-heading__title">Yang tersedia dan yang belum terhubung</h2>
        </div>
        <div class="capability-matrix mt-8" data-reveal-stagger>
            <article class="card card--dark p-6">
                <span class="text-xs font-bold text-emerald-300">TERSEDIA</span>
                <h3 class="mt-3 text-lg font-extrabold">Laporan kendala jalan</h3>
                <p class="mt-2 text-sm text-slate-300">Nilai ditampilkan bersama unit, wilayah, sumber, dan waktu observasi.</p>
            </article>
            <article class="card p-6">
                <span class="text-xs font-bold text-slate-600">BELUM TERHUBUNG</span>
                <h3 class="mt-3 text-lg font-extrabold text-slate-900">Posisi armada</h3>
                <p class="mt-2 text-sm text-slate-500">Membutuhkan feed GPS dan kebijakan retensi data.</p>
            </article>
            <article class="card p-6">
                <span class="text-xs font-bold text-slate-600">BELUM TERHUBUNG</span>
                <h3 class="mt-3 text-lg font-extrabold text-slate-900">ETA transportasi</h3>
                <p class="mt-2 text-sm text-slate-500">Belum ada sumber jadwal atau telemetry operasional.</p>
            </article>
            <article class="card p-6">
                <span class="text-xs font-bold text-slate-600">BELUM DIHITUNG</span>
                <h3 class="mt-3 text-lg font-extrabold text-slate-900">Skor mobilitas</h3>
                <p class="mt-2 text-sm text-slate-500">Normalization rules dan benchmark masih kosong.</p>
            </article>
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;">
    <div class="grid gap-6 lg:grid-cols-12" data-reveal-stagger>
        <div class="card p-7 lg:col-span-7">
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Alur berikutnya</span>
            <h2 class="mt-3 text-2xl font-extrabold text-slate-950">Dari laporan menuju prioritas penanganan</h2>
            <ol class="mt-6 grid gap-3 sm:grid-cols-3">
                <li class="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <strong class="text-sm text-slate-900">1. Validasi</strong>
                    <p class="mt-1 text-xs text-slate-500">Petugas memoderasi laporan.</p>
                </li>
                <li class="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <strong class="text-sm text-slate-900">2. Agregasi</strong>
                    <p class="mt-1 text-xs text-slate-500">Sinyal dihitung per wilayah dan periode.</p>
                </li>
                <li class="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <strong class="text-sm text-slate-900">3. Prioritas</strong>
                    <p class="mt-1 text-xs text-slate-500">Belum aktif sampai factor rules tersedia.</p>
                </li>
            </ol>
        </div>
        <aside class="cta-card cta-card--emerald lg:col-span-5">
            <h2 class="text-2xl font-extrabold text-emerald-950">Menemukan kendala mobilitas?</h2>
            <p class="mt-2 text-sm leading-relaxed text-emerald-800">Kirim laporan dengan lokasi yang cukup untuk petugas, tanpa mencantumkan data pribadi.</p>
            <button type="button" data-modal-target="modal-lapor" class="button button--signal mt-6 w-full sm:w-auto">Buat laporan warga</button>
        </aside>
    </div>
</section>
@endsection
