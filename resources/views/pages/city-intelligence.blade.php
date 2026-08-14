@extends('layouts.app')

@section('title', 'City Intelligence | URBANPULSE')
@section('meta_description', 'City Intelligence URBANPULSE menyatukan metric lintas domain, provenance, dan kesiapan analisis kota.')

@section('content')
<section class="page-hero page-hero--intelligence px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-6xl relative z-10">
        <nav aria-label="Breadcrumb" class="mb-6 text-xs font-semibold">
            <a href="{{ route('home') }}" class="hover:text-emerald-300">Dashboard</a>
            <span class="mx-2 text-slate-500">/</span>
            <span class="text-slate-300">City Intelligence</span>
        </nav>
        <div class="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div class="lg:col-span-8">
                <h1 class="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">Hubungkan data kota menjadi informasi yang dapat ditindaklanjuti.</h1>
                <p class="page-hero__lead mt-4 max-w-2xl text-base leading-relaxed">Tinjau kesiapan lima domain URBANPULSE, provenance sumber, dan batas kemampuan analitik Foundation pada satu tempat.</p>
            </div>
            <div class="amber-callout lg:col-span-4" data-reveal>
                <p class="text-xs font-extrabold uppercase tracking-wider text-amber-800">City Score</p>
                <strong class="mt-2 block text-2xl text-amber-950">Belum dihitung</strong>
                <p class="mt-1 text-xs leading-relaxed text-amber-800">Normalization rules dan benchmark belum disetujui.</p>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 py-12 sm:px-12 lg:px-24 xl:px-32">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
        <div class="stat-card stat-card--dark">
            <span class="stat-card__label">Wilayah</span>
            <strong class="stat-card__value" style="font-size:1.25rem;">{{ $snapshot['region']?->name ?? 'Belum tersedia' }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Metric tervalidasi</span>
            <strong class="stat-card__value">{{ $snapshot['metric_count'] }}</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Domain terisi</span>
            <strong class="stat-card__value">{{ $snapshot['category_count'] }}/5</strong>
        </div>
        <div class="stat-card">
            <span class="stat-card__label">Sumber pada snapshot</span>
            <strong class="stat-card__value">{{ $snapshot['sources']->count() }}</strong>
        </div>
    </div>

    <div class="mt-14 flex flex-col justify-between gap-4 md:flex-row md:items-end" data-reveal>
        <div>
            <p class="section-heading__kicker">Lima domain kota</p>
            <h2 class="section-heading__title">Ketersediaan metric per domain</h2>
        </div>
        <p class="max-w-xl text-sm leading-relaxed text-slate-500">Satu metric tervalidasi belum cukup untuk menghasilkan City Score. Tampilan ini menunjukkan readiness, bukan penilaian performa kota.</p>
    </div>

    <div class="readiness-grid mt-8" data-reveal-stagger>
        @foreach (\App\Enums\MetricCategory::cases() as $category)
            @php($metric = $snapshot['metrics']->first(fn ($item) => $item->definition->category === $category))
            @if ($metric)
                <x-city-metric-card :metric="$metric" />
            @else
                <article class="empty-capability">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{{ $category->label() }}</span>
                    <h3 class="mt-5 text-lg font-extrabold text-slate-900">Data belum tersedia</h3>
                    <p class="mt-2 text-xs leading-relaxed text-slate-500">Hubungkan sumber dan validasi metric sebelum domain dianalisis.</p>
                </article>
            @endif
        @endforeach
    </div>
</section>

<section class="border-y border-slate-200 bg-slate-50" style="padding: var(--section-gap) 0;">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 sm:px-12 lg:grid-cols-12 lg:px-24 xl:px-32">
        <div class="lg:col-span-5" data-reveal>
            <p class="section-heading__kicker">Provenance</p>
            <h2 class="section-heading__title">Sumber yang dapat ditelusuri</h2>
            <p class="section-heading__desc">Setiap observasi tetap terhubung ke sumber dan attribution agar asal datanya dapat ditelusuri.</p>
        </div>
        <div class="space-y-3 lg:col-span-7" data-reveal-stagger>
            @forelse ($snapshot['sources'] as $source)
                <article class="source-ledger__row">
                    <div class="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                            <h3 class="font-extrabold text-slate-900">{{ $source->name }}</h3>
                            <p class="mt-1 text-xs text-slate-500">{{ $source->attribution }}</p>
                        </div>
                        <span class="self-start text-[10px] font-bold uppercase text-slate-500">{{ $source->type->value }}</span>
                    </div>
                </article>
            @empty
                <div class="card card--placeholder p-8 text-sm text-slate-500">Belum ada sumber pada snapshot.</div>
            @endforelse
        </div>
    </div>
</section>

<section class="mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 xl:px-32" style="padding: var(--section-gap) 0;">
    <div class="capability-grid" data-reveal-stagger>
        <article class="empty-capability empty-capability--priority">
            <span class="text-xs font-extrabold text-amber-700">PRIORITY ENGINE</span>
            <h2 class="mt-3 text-2xl font-extrabold text-slate-950">Belum dihitung</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ $reportSummary['total'] }} laporan publik tersedia sebagai input, tetapi factor rules belum dijalankan.</p>
        </article>
        <article class="empty-capability">
            <span class="text-xs font-extrabold text-slate-500">ANALYTICS</span>
            <h2 class="mt-3 text-2xl font-extrabold text-slate-950">Belum tersedia</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">Tren membutuhkan seri waktu yang cukup, bukan satu snapshot observasi.</p>
        </article>
        <article class="empty-capability">
            <span class="text-xs font-extrabold text-slate-500">AI INSIGHT</span>
            <h2 class="mt-3 text-2xl font-extrabold text-slate-950">Belum aktif</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">AI menunggu aggregator, prompt builder, response validator, dan provider yang disetujui.</p>
        </article>
    </div>
</section>
@endsection
