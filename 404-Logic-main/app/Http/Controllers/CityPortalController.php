<?php

namespace App\Http\Controllers;

use App\Enums\MetricCategory;
use App\Services\CityIntelligence\CityIntelligenceQueryService;
use App\Services\Reports\ReportQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class CityPortalController extends Controller
{
    public function index(
        CityIntelligenceQueryService $cityIntelligence,
        ReportQueryService $reports,
    ): View {
        return view('pages.home', [
            'snapshot' => $cityIntelligence->snapshot(),
            'reportSummary' => $reports->publicSummary(),
            'recentReports' => $reports->communityFeed(3),
        ]);
    }

    public function cityIntelligence(
        CityIntelligenceQueryService $cityIntelligence,
        ReportQueryService $reports,
    ): View {
        return view('pages.city-intelligence', [
            'snapshot' => $cityIntelligence->snapshot(),
            'reportSummary' => $reports->publicSummary(),
        ]);
    }

    public function mobilitas(CityIntelligenceQueryService $cityIntelligence): View
    {
        return view('pages.mobilitas', [
            'snapshot' => $cityIntelligence->snapshot(MetricCategory::Mobility),
        ]);
    }

    public function lingkungan(CityIntelligenceQueryService $cityIntelligence): View
    {
        return view('pages.lingkungan', [
            'snapshot' => $cityIntelligence->snapshot(MetricCategory::Environment),
        ]);
    }

    public function laporanWarga(ReportQueryService $reports): View
    {
        return view('pages.laporan-warga', [
            'reports' => $reports->communityFeed(),
            'reportSummary' => $reports->publicSummary(),
        ]);
    }

    /**
     * Service applications remain outside the approved Foundation schema.
     */
    public function submitLayanan(): JsonResponse
    {
        return response()->json([
            'message' => 'Pengajuan layanan belum tersedia dan tidak menerima atau menyimpan data pribadi.',
        ], 501);
    }
}
