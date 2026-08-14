<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\UpdateReportStatusRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\Reports\ReportWorkflowService;

class ReportStatusController extends Controller
{
    public function update(
        UpdateReportStatusRequest $request,
        Report $report,
        ReportWorkflowService $workflow,
    ): ReportResource {
        $report = $workflow->updateStatus($request->user(), $report, $request->validated());

        return (new ReportResource($report))->additional([
            'message' => 'Status laporan berhasil diperbarui.',
        ]);
    }
}
