<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\IndexReportsRequest;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\Reports\ReportWorkflowService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    public function index(IndexReportsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $reports = Report::query()
            ->published()
            ->whereNotNull('public_title')
            ->whereNotNull('public_summary')
            ->with('region')
            ->withCount('confirmations')
            ->when($filters['region_id'] ?? null, fn ($query, $regionId) => $query->where('region_id', $regionId))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, $priority) => $query->where('priority_level', $priority))
            ->latest()
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();

        return ReportResource::collection($reports)->additional([
            'meta' => [
                'generated_at' => now()->toIso8601String(),
                'is_demo' => (bool) config('urbanpulse.demo_mode'),
            ],
        ]);
    }

    public function store(StoreReportRequest $request, ReportWorkflowService $workflow): Response
    {
        $report = $workflow->create($request->user(), $request->validated());

        return (new ReportResource($report))
            ->additional([
                'message' => 'Laporan berhasil diterima.',
                'meta' => ['generated_at' => now()->toIso8601String()],
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Report $report): ReportResource
    {
        if (! $report->status->isPubliclyVisible() && Gate::denies('view', $report)) {
            abort(404, 'Laporan tidak ditemukan.');
        }

        $canViewPrivate = request()->user()?->can('view', $report) ?? false;
        $report->load('region')->loadCount('confirmations');

        if ($report->status->isPubliclyVisible() || $canViewPrivate) {
            $report->load(['updates' => fn ($query) => $query->where('is_public', true)->oldest()]);
        }

        return (new ReportResource($report))->additional([
            'meta' => [
                'generated_at' => now()->toIso8601String(),
                'is_demo' => $report->is_demo,
            ],
        ]);
    }
}
