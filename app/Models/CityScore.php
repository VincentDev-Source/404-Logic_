<?php

namespace App\Models;

use App\Enums\CityScoreStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['region_id', 'overall_score', 'period_start', 'period_end', 'calculation_version', 'weights_snapshot', 'data_completeness_percent', 'status', 'data_cutoff_at', 'calculated_at'])]
class CityScore extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['overall_score' => 'decimal:2', 'period_start' => 'datetime', 'period_end' => 'datetime', 'weights_snapshot' => 'array', 'data_completeness_percent' => 'decimal:2', 'status' => CityScoreStatus::class, 'data_cutoff_at' => 'datetime', 'calculated_at' => 'datetime'];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function components(): HasMany
    {
        return $this->hasMany(CityScoreComponent::class);
    }

    public function aiInsights(): HasMany
    {
        return $this->hasMany(AiInsight::class);
    }
}
