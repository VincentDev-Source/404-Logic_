<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\Reports\ReportWorkflowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ReportConfirmationController extends Controller
{
    public function store(Report $report, ReportWorkflowService $workflow): JsonResponse
    {
        Gate::authorize('confirm', $report);

        $result = $workflow->confirm(request()->user(), $report);

        return response()->json([
            'message' => $result['created']
                ? 'Konfirmasi berhasil dicatat.'
                : 'Konfirmasi Anda sudah tercatat.',
            'already_confirmed' => ! $result['created'],
            'confirmation_count' => $report->confirmations()->count(),
        ], $result['created'] ? 201 : 200);
    }
}
