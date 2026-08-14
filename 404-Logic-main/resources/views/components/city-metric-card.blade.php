@props(['metric'])

@php
    $numericValue = (float) $metric->value;
    $decimals = abs($numericValue - round($numericValue)) < 0.000001 ? 0 : 1;
    $displayValue = number_format($numericValue, $decimals, ',', '.');
@endphp

<article {{ $attributes->class(['domain-panel', 'domain-panel--'.$metric->definition->category->slug()]) }}>
    <div class="domain-panel__top">
        <span class="domain-panel__category">
            {{ $metric->definition->category->label() }}
        </span>
    </div>

    @if ($metric->is_estimated)
        <span class="domain-panel__estimate">Nilai estimasi</span>
    @endif

    <div class="domain-panel__value">
        <strong>{{ $displayValue }}</strong>
        <span>{{ $metric->unit }}</span>
    </div>

    <h3>{{ $metric->definition->name }}</h3>
    <p>{{ $metric->definition->description }}</p>

    <dl class="domain-panel__meta">
        <div><dt>Wilayah</dt><dd>{{ $metric->region->name }}</dd></div>
        <div><dt>Sumber</dt><dd>{{ $metric->dataSource->name }}</dd></div>
        <div><dt>Observasi</dt><dd>{{ $metric->observed_at->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i') }} WIB</dd></div>
    </dl>
</article>
