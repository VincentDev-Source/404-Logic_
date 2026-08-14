<?php

namespace App\Models;

use App\Enums\MetricAggregationMethod;
use App\Enums\MetricCategory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'category', 'name', 'canonical_unit', 'aggregation_method', 'description', 'is_active'])]
class MetricDefinition extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'category' => MetricCategory::class,
            'aggregation_method' => MetricAggregationMethod::class,
            'is_active' => 'boolean',
        ];
    }

    public function cityMetrics(): HasMany
    {
        return $this->hasMany(CityMetric::class);
    }
}
