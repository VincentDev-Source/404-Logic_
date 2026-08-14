<?php

namespace App\Models;

use App\Enums\MetricGranularity;
use App\Enums\MetricQualityStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['region_id', 'metric_definition_id', 'data_source_id', 'dimension_key', 'value', 'unit', 'granularity', 'observed_at', 'period_start', 'period_end', 'quality_status', 'is_estimated', 'lineage', 'metadata', 'ingested_at'])]
class CityMetric extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'value' => 'decimal:6',
            'granularity' => MetricGranularity::class,
            'quality_status' => MetricQualityStatus::class,
            'observed_at' => 'datetime',
            'period_start' => 'datetime',
            'period_end' => 'datetime',
            'is_estimated' => 'boolean',
            'lineage' => 'array',
            'metadata' => 'array',
            'ingested_at' => 'datetime',
        ];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(MetricDefinition::class, 'metric_definition_id');
    }

    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(DataSource::class);
    }

    public function aiInsights(): HasMany
    {
        return $this->hasMany(AiInsight::class);
    }
}
