<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['region_id', 'data_source_id', 'facility_id', 'station_code', 'observed_at', 'is_forecast', 'temperature_c', 'humidity_percent', 'rainfall_mm', 'wind_speed_m_s', 'pressure_hpa', 'condition_code', 'raw_payload', 'ingested_at'])]
class WeatherData extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'observed_at' => 'datetime',
            'is_forecast' => 'boolean',
            'temperature_c' => 'decimal:2',
            'humidity_percent' => 'decimal:2',
            'rainfall_mm' => 'decimal:2',
            'wind_speed_m_s' => 'decimal:3',
            'pressure_hpa' => 'decimal:2',
            'raw_payload' => 'array',
            'ingested_at' => 'datetime',
        ];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(DataSource::class);
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
