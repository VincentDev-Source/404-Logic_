<?php

namespace App\Services\CityIntelligence;

use App\Enums\MetricCategory;
use App\Enums\MetricQualityStatus;
use App\Models\CityMetric;
use App\Models\Region;
use Illuminate\Database\Eloquent\Collection;

class CityIntelligenceQueryService
{
    /**
     * @return array{
     *     region: Region|null,
     *     metrics: Collection<int, CityMetric>,
     *     sources: Collection,
     *     metric_count: int,
     *     category_count: int,
     *     latest_observed_at: mixed
     * }
     */
    public function snapshot(?MetricCategory $category = null): array
    {
        $region = Region::query()
            ->where('code', config('urbanpulse.default_region_code'))
            ->where('is_active', true)
            ->first();

        if (! $region) {
            return [
                'region' => null,
                'metrics' => new Collection,
                'sources' => new Collection,
                'metric_count' => 0,
                'category_count' => 0,
                'latest_observed_at' => null,
            ];
        }

        $metrics = CityMetric::query()
            ->with(['definition', 'dataSource', 'region'])
            ->where('region_id', $region->id)
            ->where('quality_status', MetricQualityStatus::Validated)
            ->when(
                $category,
                fn ($query) => $query->whereHas(
                    'definition',
                    fn ($definitionQuery) => $definitionQuery->where('category', $category->value),
                ),
            )
            ->orderByDesc('observed_at')
            ->orderByDesc('id')
            ->get()
            ->unique('metric_definition_id')
            ->values();

        return [
            'region' => $region,
            'metrics' => $metrics,
            'sources' => $metrics->pluck('dataSource')->filter()->unique('id')->values(),
            'metric_count' => $metrics->count(),
            'category_count' => $metrics->pluck('definition.category.value')->unique()->count(),
            'latest_observed_at' => $metrics->first()?->observed_at,
        ];
    }
}
