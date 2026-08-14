<?php

namespace App\Models;

use App\Enums\DataSourceStatus;
use App\Enums\DataSourceType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'name', 'type', 'provider', 'status', 'is_demo', 'license', 'attribution', 'refresh_interval_minutes', 'last_synced_at', 'last_sync_error', 'metadata'])]
class DataSource extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => DataSourceType::class,
            'status' => DataSourceStatus::class,
            'is_demo' => 'boolean',
            'refresh_interval_minutes' => 'integer',
            'last_synced_at' => 'datetime',
            'metadata' => 'array',
        ];
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
}
