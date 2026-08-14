<?php

namespace App\Models;

use App\Enums\AiInsightStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['region_id', 'city_metric_id', 'report_id', 'city_score_id', 'input_hash', 'insight_type', 'title', 'summary', 'evidence', 'recommendations', 'provider', 'model', 'prompt_version', 'response_schema_version', 'confidence', 'input_snapshot', 'status', 'generated_at', 'published_at', 'expires_at', 'reviewed_by_user_id', 'reviewed_at'])]
class AiInsight extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['evidence' => 'array', 'recommendations' => 'array', 'confidence' => 'decimal:4', 'input_snapshot' => 'array', 'status' => AiInsightStatus::class, 'generated_at' => 'datetime', 'published_at' => 'datetime', 'expires_at' => 'datetime', 'reviewed_at' => 'datetime'];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function cityMetric(): BelongsTo
    {
        return $this->belongsTo(CityMetric::class);
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function cityScore(): BelongsTo
    {
        return $this->belongsTo(CityScore::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }
}
