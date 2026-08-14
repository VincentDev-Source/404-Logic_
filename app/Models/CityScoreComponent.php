<?php

namespace App\Models;

use App\Enums\MetricCategory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['city_score_id', 'category', 'normalized_score', 'weight', 'weighted_score', 'metric_count', 'data_completeness_percent', 'input_snapshot', 'explanation'])]
class CityScoreComponent extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'category' => MetricCategory::class,
            'normalized_score' => 'decimal:2',
            'weight' => 'decimal:5',
            'weighted_score' => 'decimal:2',
            'metric_count' => 'integer',
            'data_completeness_percent' => 'decimal:2',
            'input_snapshot' => 'array',
        ];
    }

    public function cityScore(): BelongsTo
    {
        return $this->belongsTo(CityScore::class);
    }
}
