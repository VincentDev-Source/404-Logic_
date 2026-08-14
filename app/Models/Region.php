<?php

namespace App\Models;

use App\Enums\RegionType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['parent_id', 'code', 'name', 'type', 'area_sq_km', 'center_latitude', 'center_longitude', 'boundary_geojson', 'bbox_min_latitude', 'bbox_max_latitude', 'bbox_min_longitude', 'bbox_max_longitude', 'is_active', 'is_demo', 'boundary_updated_at'])]
class Region extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => RegionType::class,
            'area_sq_km' => 'decimal:3',
            'center_latitude' => 'decimal:7',
            'center_longitude' => 'decimal:7',
            'boundary_geojson' => 'array',
            'bbox_min_latitude' => 'decimal:7',
            'bbox_max_latitude' => 'decimal:7',
            'bbox_min_longitude' => 'decimal:7',
            'bbox_max_longitude' => 'decimal:7',
            'is_active' => 'boolean',
            'is_demo' => 'boolean',
            'boundary_updated_at' => 'datetime',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function cityMetrics(): HasMany
    {
        return $this->hasMany(CityMetric::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class);
    }

    public function weatherData(): HasMany
    {
        return $this->hasMany(WeatherData::class);
    }

    public function airQuality(): HasMany
    {
        return $this->hasMany(AirQuality::class);
    }

    public function cityScores(): HasMany
    {
        return $this->hasMany(CityScore::class);
    }

    public function aiInsights(): HasMany
    {
        return $this->hasMany(AiInsight::class);
    }
}
