<?php

namespace Database\Seeders;

use App\Enums\DataSourceStatus;
use App\Enums\DataSourceType;
use App\Enums\MetricAggregationMethod;
use App\Enums\MetricCategory;
use App\Enums\MetricGranularity;
use App\Enums\MetricQualityStatus;
use App\Enums\RegionType;
use App\Enums\ReportCategory;
use App\Enums\ReportStatus;
use App\Enums\ReportUpdateType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\CityMetric;
use App\Models\DataSource;
use App\Models\MetricDefinition;
use App\Models\Region;
use App\Models\Report;
use App\Models\ReportConfirmation;
use App\Models\ReportUpdate;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UrbanPulseDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $reporter = $this->demoUser('demo.reporter@urbanpulse.test', 'Warga Demo URBANPULSE');
            $confirmer = $this->demoUser('demo.confirmer@urbanpulse.test', 'Konfirmator Demo URBANPULSE');

            $region = Region::query()->updateOrCreate(
                ['code' => config('urbanpulse.default_region_code')],
                [
                    'name' => 'Kota URBANPULSE',
                    'type' => RegionType::City,
                    'center_latitude' => -6.2383000,
                    'center_longitude' => 106.9756000,
                    'is_active' => true,
                    'is_demo' => true,
                ],
            );

            $source = DataSource::query()->updateOrCreate(
                ['code' => 'demo.urbanpulse.foundation'],
                [
                    'name' => 'URBANPULSE Foundation',
                    'type' => DataSourceType::Manual,
                    'provider' => '404-Logic',
                    'status' => DataSourceStatus::Active,
                    'is_demo' => true,
                    'attribution' => 'Data dikelola oleh URBANPULSE Foundation dengan provenance per observasi.',
                    'metadata' => ['purpose' => 'competition_demo', 'real_world_claim' => false],
                ],
            );

            $observedAt = CarbonImmutable::parse('2026-08-12T01:00:00Z');
            $definitions = [
                ['environment.pm25', MetricCategory::Environment, 'PM2.5', 'µg/m³', MetricAggregationMethod::Average, 18],
                ['mobility.road_issue_reports', MetricCategory::Mobility, 'Laporan Kendala Jalan', 'reports', MetricAggregationMethod::Sum, 43],
                ['infrastructure.drainage_reports', MetricCategory::Infrastructure, 'Laporan Drainase', 'reports', MetricAggregationMethod::Sum, 67],
                ['public_services.digital_service_count', MetricCategory::PublicServices, 'Layanan Digital', 'services', MetricAggregationMethod::Latest, 38],
                ['community.confirmed_resolution_rate', MetricCategory::Community, 'Resolusi Terkonfirmasi', '%', MetricAggregationMethod::Average, 76.4],
            ];

            foreach ($definitions as [$code, $category, $name, $unit, $aggregation, $value]) {
                $definition = MetricDefinition::query()->updateOrCreate(
                    ['code' => $code],
                    [
                        'category' => $category,
                        'name' => $name,
                        'canonical_unit' => $unit,
                        'aggregation_method' => $aggregation,
                        'description' => 'Definisi metric Foundation URBANPULSE dengan unit dan provenance yang dapat ditelusuri.',
                        'is_active' => true,
                    ],
                );

                CityMetric::query()->updateOrCreate(
                    [
                        'region_id' => $region->id,
                        'metric_definition_id' => $definition->id,
                        'data_source_id' => $source->id,
                        'dimension_key' => 'all',
                        'observed_at' => $observedAt,
                        'granularity' => MetricGranularity::Instant,
                    ],
                    [
                        'value' => $value,
                        'unit' => $unit,
                        'quality_status' => MetricQualityStatus::Validated,
                        'is_estimated' => true,
                        'metadata' => ['is_demo' => true],
                        'ingested_at' => $observedAt,
                    ],
                );
            }

            $reports = [
                [
                    'tracking_code' => 'UP-DEMO-2026-DRN67',
                    'category' => ReportCategory::Infrastructure,
                    'status' => ReportStatus::InProgress,
                    'severity' => 4,
                    'title' => 'Drainase tersumbat pada koridor utama',
                    'description' => 'Laporan drainase meningkat pada periode hujan dan diteruskan ke alur prioritas tindakan.',
                    'public_title' => 'Drainase tersumbat pada koridor utama',
                    'public_summary' => 'Laporan drainase meningkat pada periode hujan dan diteruskan ke alur prioritas tindakan.',
                    'location_text' => 'Koridor Barat',
                ],
                [
                    'tracking_code' => 'UP-DEMO-2026-LGT12',
                    'category' => ReportCategory::PublicServices,
                    'status' => ReportStatus::Verified,
                    'severity' => 3,
                    'title' => 'Penerangan jalan perlu pemeriksaan',
                    'description' => 'Penerangan jalan memerlukan pemeriksaan dan pelacakan tindak lanjut.',
                    'public_title' => 'Penerangan jalan perlu pemeriksaan',
                    'public_summary' => 'Penerangan jalan memerlukan pemeriksaan dan pelacakan tindak lanjut.',
                    'location_text' => 'Distrik Tengah',
                ],
                [
                    'tracking_code' => 'UP-DEMO-2026-WST08',
                    'category' => ReportCategory::Environment,
                    'status' => ReportStatus::Resolved,
                    'severity' => 2,
                    'title' => 'Penumpukan sampah telah ditangani',
                    'description' => 'Laporan lingkungan telah selesai ditangani dengan riwayat yang dapat dilacak.',
                    'public_title' => 'Penumpukan sampah telah ditangani',
                    'public_summary' => 'Laporan lingkungan telah selesai ditangani dengan riwayat yang dapat dilacak.',
                    'location_text' => 'Taman Kota',
                ],
            ];

            foreach ($reports as $attributes) {
                $report = Report::query()->updateOrCreate(
                    ['tracking_code' => $attributes['tracking_code']],
                    [...$attributes, 'user_id' => $reporter->id, 'region_id' => $region->id, 'is_demo' => true],
                );

                ReportUpdate::query()->firstOrCreate(
                    [
                        'report_id' => $report->id,
                        'update_type' => ReportUpdateType::Status,
                        'to_status' => $report->status,
                    ],
                    [
                        'actor_user_id' => null,
                        'note' => 'Riwayat awal laporan.',
                        'is_public' => true,
                        'metadata' => ['is_demo' => true],
                    ],
                );

                ReportConfirmation::query()->firstOrCreate([
                    'report_id' => $report->id,
                    'user_id' => $confirmer->id,
                ]);
            }
        });
    }

    private function demoUser(string $email, string $name): User
    {
        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make(Str::random(64)),
                'role' => UserRole::Citizen,
                'status' => UserStatus::Active,
            ],
        );

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return $user;
    }
}
