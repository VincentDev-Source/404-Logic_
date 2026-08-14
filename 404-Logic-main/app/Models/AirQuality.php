<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['region_id', 'data_source_id', 'facility_id', 'station_code', 'observed_at', 'air_quality_index', 'index_standard', 'category', 'pm25_ug_m3', 'pm10_ug_m3', 'no2_ug_m3', 'so2_ug_m3', 'co_mg_m3', 'o3_ug_m3', 'raw_payload', 'ingested_at'])]
class AirQuality extends Model
{
    use HasFactory;

    protected $table = 'air_quality';

    protected function casts(): array
    {
        return [
            'observed_at' => 'datetime',
            'air_quality_index' => 'integer',
            'pm25_ug_m3' => 'decimal:3',
            'pm10_ug_m3' => 'decimal:3',
            'no2_ug_m3' => 'decimal:3',
            'so2_ug_m3' => 'decimal:3',
            'co_mg_m3' => 'decimal:3',
            'o3_ug_m3' => 'decimal:3',
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
