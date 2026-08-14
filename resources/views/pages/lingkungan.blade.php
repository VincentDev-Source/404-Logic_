@extends('layouts.app')

@section('title', 'Lingkungan Kota | URBANPULSE')
@section('meta_description', 'Lingkungan Kota URBANPULSE menyajikan metric lingkungan berprovenance tanpa klasifikasi kesehatan yang belum terverifikasi.')

@section('content')
<section class="page-hero page-hero--environment px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-6xl relative z-10">
        <nav aria-label="Breadcrumb" class="mb-6 text-xs font-semibold">
            <a href="{{ route('home') }}" class="hover:text-emerald-300">Dashboard</a>
            <span class="mx-2 text-slate-500">/</span>
            <span class="text-slate-300">Lingkungan Kota</span>
        </nav>
        <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-8">
                <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Lingkungan Kota</h1>
                <p class="page-hero__lead mt-4 max-w-2xl text-base leading-relaxed">Lihat observasi lingkungan apa adanya, lengkap dengan unit, sumber, wilayah, dan waktu. Kategori kesehatan belum dihitung.</p>
            </div>
            <div class="amber-callout lg:col-span-4" data-reveal>
                <p class="text-xs font-extrabold uppercase tracking-wider text-amber-800">Klasifikasi ISPU</p>
                <strong class="mt-2 block text-xl text-amber-950">Belum dihitung</strong>
                <p class="mt-1 text-xs leading-relaxed text-amber-800">Threshold dan normalization rules belum disetujui.</p>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;">
    <div class="grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-5" data-reveal>
            <p class="section-heading__kicker">Metric tersedia</p>
            <h2 class="section-heading__title">Observasi PM2.5</h2>
            <p class="section-heading__desc">Angka ditampilkan sebagai nilai estimasi. URBANPULSE belum memberikan rekomendasi kesehatan dari satu observasi.</p>
        </div>
        <div class="lg:col-span-7" data-reveal-stagger>
            @forelse ($snapshot['metrics'] as $metric)
                <x-city-metric-card :metric="$metric" class="max-w-xl" />
            @empty
                <div class="card card--placeholder p-10 text-center">
                    <h3 class="font-extrabold text-slate-900">Metric lingkungan belum tersedia</h3>
                    <p class="mt-2 text-sm text-slate-500">Hubungkan sumber lingkungan dan validasi observasinya.</p>
                </div>
            @endforelse
        </div>
    </div>
</section>

<section class="border-y border-slate-200 bg-slate-50" style="padding: var(--section-gap) 0;">
    <div class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32">
        <div class="max-w-2xl" data-reveal>
            <p class="section-heading__kicker">Coverage data</p>
            <h2 class="section-heading__title">Gap yang masih harus diisi</h2>
            <p class="section-heading__desc">Metric kosong ditampilkan terbuka agar pengguna memahami batas snapshot saat ini.</p>
        </div>
        <div class="gap-contour-grid mt-8" data-reveal-stagger>
            @foreach ([['PM10', 'Konsentrasi partikel'], ['NO₂ / SO₂ / O₃', 'Gas pencemar'], ['Cuaca', 'Suhu dan kelembapan'], ['Curah hujan', 'Observasi dan forecast'], ['Risiko lingkungan', 'Rule dan layer hazard'], ['Tren', 'Seri waktu yang memadai']] as [$name, $description])
                <article class="empty-capability">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600">Belum tersedia</span>
                    <h3 class="mt-3 font-extrabold text-slate-900">{{ $name }}</h3>
                    <p class="mt-1 text-xs text-slate-500">{{ $description }}</p>
                </article>
            @endforeach
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;">
    <div class="grid gap-6 lg:grid-cols-2" data-reveal-stagger>
        <article class="card p-7">
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Metodologi</span>
            <h2 class="mt-3 text-2xl font-extrabold text-slate-950">Nilai dulu, interpretasi kemudian</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">Pipeline menyimpan nilai asli dan canonical unit. Kategori, skor, serta rekomendasi hanya boleh muncul setelah benchmark, arah metric, dan batas normalisasi disetujui.</p>
        </article>
        <aside class="cta-card cta-card--dark">
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-300 relative z-10">Partisipasi warga</span>
            <h2 class="mt-3 text-2xl font-extrabold relative z-10">Laporkan masalah lingkungan</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-300 relative z-10">Gunakan Laporan Warga untuk sampah, drainase, kualitas ruang publik, atau gangguan lingkungan lain.</p>
            <a href="{{ route('laporan-warga') }}" class="button button--signal mt-6 relative z-10 w-full sm:w-auto text-center">Buka Laporan Warga</a>
        </aside>
    </div>
</section>
@endsection
