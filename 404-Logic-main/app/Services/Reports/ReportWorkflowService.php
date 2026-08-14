<?php

namespace App\Services\Reports;

use App\Enums\ReportStatus;
use App\Enums\ReportUpdateType;
use App\Enums\UserRole;
use App\Models\Region;
use App\Models\Report;
use App\Models\ReportConfirmation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReportWorkflowService
{
    /** @var array<string, list<string>> */
    private const STATUS_TRANSITIONS = [
        'submitted' => ['verified', 'rejected'],
        'verified' => ['in_progress', 'rejected'],
        'in_progress' => ['resolved', 'verified'],
        'resolved' => [],
        'rejected' => ['submitted'],
    ];

    public function create(User $user, array $attributes): Report
    {
        return DB::transaction(function () use ($user, $attributes): Report {
            $region = $this->resolveRegion($attributes['region_id'] ?? null);

            $report = Report::create([
                'tracking_code' => $this->generateTrackingCode(),
                'user_id' => $user->id,
                'region_id' => $region->id,
                'category' => $attributes['category'],
                'status' => ReportStatus::Submitted,
                'title' => $attributes['title'],
                'description' => $attributes['description'],
                'location_text' => $attributes['address'],
                'latitude' => $attributes['latitude'] ?? null,
                'longitude' => $attributes['longitude'] ?? null,
                'occurred_at' => $attributes['occurred_at'] ?? null,
                'is_demo' => false,
            ]);

            $report->updates()->create([
                'actor_user_id' => $user->id,
                'update_type' => ReportUpdateType::Status,
                'to_status' => ReportStatus::Submitted,
                'note' => 'Laporan diterima oleh URBANPULSE.',
                'is_public' => true,
            ]);

            return $report->load('region')->loadCount('confirmations');
        });
    }

    /** @return array{confirmation: ReportConfirmation, created: bool} */
    public function confirm(User $user, Report $report): array
    {
        return DB::transaction(function () use ($user, $report): array {
            $currentUser = User::query()->whereKey($user->getKey())->firstOrFail();
            $currentReport = Report::query()
                ->whereKey($report->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            if (! $currentUser->isActive()
                || ! $currentUser->hasVerifiedEmail()
                || $currentUser->role !== UserRole::Citizen
                || ! $currentReport->status->isPubliclyVisible()
                || ! $currentReport->status->isOpen()
                || $currentReport->user_id === $currentUser->id) {
                throw ValidationException::withMessages([
                    'report' => 'Laporan ini tidak dapat dikonfirmasi.',
                ]);
            }

            $created = ReportConfirmation::query()->insertOrIgnore([
                'report_id' => $currentReport->id,
                'user_id' => $currentUser->id,
                'created_at' => now(),
            ]) === 1;
            $confirmation = ReportConfirmation::query()
                ->where('report_id', $currentReport->id)
                ->where('user_id', $currentUser->id)
                ->firstOrFail();

            return ['confirmation' => $confirmation, 'created' => $created];
        });
    }

    public function updateStatus(User $user, Report $report, array $attributes): Report
    {
        $nextStatus = ReportStatus::from($attributes['status']);

        return DB::transaction(function () use ($user, $report, $attributes, $nextStatus): Report {
            $currentReport = Report::query()
                ->whereKey($report->getKey())
                ->lockForUpdate()
                ->firstOrFail();
            $currentStatus = $currentReport->status;

            if (! in_array($nextStatus->value, self::STATUS_TRANSITIONS[$currentStatus->value], true)) {
                throw ValidationException::withMessages([
                    'status' => "Perubahan status dari {$currentStatus->value} ke {$nextStatus->value} tidak diizinkan.",
                ]);
            }

            if ($nextStatus === ReportStatus::Verified
                && (! ($attributes['public_title'] ?? $currentReport->public_title)
                    || ! ($attributes['public_summary'] ?? $currentReport->public_summary))) {
                throw ValidationException::withMessages([
                    'public_title' => 'Judul publik wajib diisi saat laporan diverifikasi.',
                    'public_summary' => 'Ringkasan publik wajib diisi saat laporan diverifikasi.',
                ]);
            }

            $updated = Report::query()
                ->whereKey($currentReport->getKey())
                ->where('status', $currentStatus->value)
                ->update([
                    'status' => $nextStatus,
                    'severity' => $attributes['severity'] ?? $currentReport->severity,
                    'public_title' => $attributes['public_title'] ?? $currentReport->public_title,
                    'public_summary' => $attributes['public_summary'] ?? $currentReport->public_summary,
                    'resolved_at' => $nextStatus === ReportStatus::Resolved ? now() : null,
                    'updated_at' => now(),
                ]);

            if ($updated !== 1) {
                throw ValidationException::withMessages([
                    'status' => 'Status laporan berubah saat diproses. Muat ulang data dan coba lagi.',
                ]);
            }

            $currentReport->updates()->create([
                'actor_user_id' => $user->id,
                'update_type' => ReportUpdateType::Status,
                'from_status' => $currentStatus,
                'to_status' => $nextStatus,
                'note' => $attributes['note'] ?? null,
                'is_public' => false,
            ]);

            return $currentReport->refresh()->load('region', 'updates')->loadCount('confirmations');
        });
    }

    private function resolveRegion(?int $regionId): Region
    {
        $query = Region::query()->where('is_active', true);

        $region = $regionId
            ? $query->find($regionId)
            : $query->where('code', config('urbanpulse.default_region_code'))->first();

        if (! $region) {
            throw ValidationException::withMessages([
                'region_id' => 'Wilayah laporan belum tersedia.',
            ]);
        }

        return $region;
    }

    private function generateTrackingCode(): string
    {
        do {
            $code = 'UP-'.now()->format('Y').'-'.Str::upper(bin2hex(random_bytes(8)));
        } while (Report::query()->where('tracking_code', $code)->exists());

        return $code;
    }
}
