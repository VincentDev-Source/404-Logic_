<?php

namespace App\Models;

use App\Enums\ReportStatus;
use App\Enums\ReportUpdateType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['report_id', 'actor_user_id', 'update_type', 'from_status', 'to_status', 'note', 'is_public', 'metadata'])]
class ReportUpdate extends Model
{
    public const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'update_type' => ReportUpdateType::class,
            'from_status' => ReportStatus::class,
            'to_status' => ReportStatus::class,
            'is_public' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
