<?php

namespace App\Models;

use App\Enums\PriorityLevel;
use App\Enums\ReportCategory;
use App\Enums\ReportStatus;
use App\Policies\ReportPolicy;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[RouteKey('tracking_code')]
#[UsePolicy(ReportPolicy::class)]
#[Fillable(['tracking_code', 'user_id', 'region_id', 'assigned_to_user_id', 'category', 'status', 'severity', 'title', 'description', 'public_title', 'public_summary', 'location_text', 'latitude', 'longitude', 'evidence_path', 'occurred_at', 'resolved_at', 'priority_score', 'priority_level', 'priority_version', 'priority_factors', 'priority_calculated_at', 'is_demo'])]
class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'category' => ReportCategory::class,
            'status' => ReportStatus::class,
            'severity' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'occurred_at' => 'datetime',
            'resolved_at' => 'datetime',
            'priority_score' => 'decimal:2',
            'priority_level' => PriorityLevel::class,
            'priority_factors' => 'array',
            'priority_calculated_at' => 'datetime',
            'is_demo' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereIn('status', ReportStatus::publiclyVisibleValues());
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ReportUpdate::class);
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(ReportConfirmation::class);
    }

    public function aiInsights(): HasMany
    {
        return $this->hasMany(AiInsight::class);
    }
}
