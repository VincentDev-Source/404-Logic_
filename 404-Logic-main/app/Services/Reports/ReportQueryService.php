<?php

namespace App\Services\Reports;

use App\Models\Report;
use App\Models\ReportConfirmation;
use Illuminate\Database\Eloquent\Collection;

class ReportQueryService
{
    /** @return Collection<int, Report> */
    public function communityFeed(int $limit = 20): Collection
    {
        return Report::query()
            ->published()
            ->with('region')
            ->withCount('confirmations')
            ->whereNotNull('public_title')
            ->whereNotNull('public_summary')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /** @return array{total: int, verified: int, in_progress: int, resolved: int, confirmations: int, demo: int} */
    public function publicSummary(): array
    {
        $query = Report::query()
            ->published()
            ->whereNotNull('public_title')
            ->whereNotNull('public_summary');

        $counts = (clone $query)
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $confirmations = ReportConfirmation::query()
            ->whereHas('report', fn ($reportQuery) => $reportQuery
                ->published()
                ->whereNotNull('public_title')
                ->whereNotNull('public_summary'))
            ->count();

        return [
            'total' => (int) $counts->sum(),
            'verified' => (int) ($counts['verified'] ?? 0),
            'in_progress' => (int) ($counts['in_progress'] ?? 0),
            'resolved' => (int) ($counts['resolved'] ?? 0),
            'confirmations' => $confirmations,
            'demo' => (clone $query)->where('is_demo', true)->count(),
        ];
    }
}
