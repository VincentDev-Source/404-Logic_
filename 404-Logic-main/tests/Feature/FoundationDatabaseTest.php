<?php

namespace Tests\Feature;

use App\Enums\MetricCategory;
use App\Enums\RegionType;
use App\Enums\UserRole;
use App\Models\DataSource;
use App\Models\MetricDefinition;
use App\Models\Region;
use App\Models\Report;
use App\Models\User;
use Database\Seeders\UrbanPulseDemoSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class FoundationDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_foundation_schema_and_model_casts_are_available(): void
    {
        foreach ([
            'regions', 'data_sources', 'metric_definitions', 'city_metrics',
            'reports', 'report_updates', 'report_confirmations', 'facilities',
            'weather_data', 'air_quality', 'city_scores',
            'city_score_components', 'ai_insights',
        ] as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table: {$table}");
        }

        $this->assertTrue(Schema::hasColumns('reports', [
            'tracking_code', 'user_id', 'region_id', 'category', 'status',
            'public_title', 'public_summary', 'latitude', 'longitude', 'priority_score', 'is_demo',
        ]));

        $user = User::factory()->admin()->create();
        $region = Region::create([
            'code' => 'test-city',
            'name' => 'Test City',
            'type' => RegionType::City,
        ]);

        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertSame(RegionType::City, $region->type);
    }

    public function test_demo_seeder_is_repeatable_and_has_provenance(): void
    {
        $this->seed(UrbanPulseDemoSeeder::class);
        $this->seed(UrbanPulseDemoSeeder::class);

        $this->assertSame(1, Region::query()->count());
        $this->assertSame(1, DataSource::query()->count());
        $this->assertSame(5, MetricDefinition::query()->count());
        $this->assertSame(3, Report::query()->count());
        $this->assertTrue(DataSource::query()->where('is_demo', true)->exists());
        $this->assertFalse(Report::query()->where('is_demo', false)->exists());
        $this->assertSame(
            MetricCategory::Environment,
            MetricDefinition::query()->where('code', 'environment.pm25')->firstOrFail()->category,
        );
    }

    public function test_default_database_seeder_does_not_insert_demo_data_without_opt_in(): void
    {
        config()->set('urbanpulse.seed_demo', false);

        $this->seed();

        $this->assertSame(0, Region::query()->count());
        $this->assertSame(0, Report::query()->count());
    }

    public function test_report_tracking_code_is_enforced_as_unique_by_database(): void
    {
        $user = User::factory()->create();
        $region = Region::create([
            'code' => 'unique-test-city',
            'name' => 'Unique Test City',
            'type' => RegionType::City,
        ]);
        $attributes = [
            'tracking_code' => 'UP-2026-ABCDEF1234567890',
            'user_id' => $user->id,
            'region_id' => $region->id,
            'category' => 'infrastructure',
            'status' => 'submitted',
            'title' => 'Laporan constraint',
            'description' => 'Data untuk menguji unique constraint tracking code.',
            'location_text' => 'Area pengujian',
        ];

        Report::create($attributes);

        $this->expectException(QueryException::class);
        Report::create($attributes);
    }

    public function test_deleting_report_owner_keeps_report_and_nulls_ownership(): void
    {
        $user = User::factory()->create();
        $region = Region::create([
            'code' => 'retention-test-city',
            'name' => 'Retention Test City',
            'type' => RegionType::City,
        ]);
        $report = Report::create([
            'tracking_code' => 'UP-2026-1234567890ABCDEF',
            'user_id' => $user->id,
            'region_id' => $region->id,
            'category' => 'environment',
            'status' => 'submitted',
            'title' => 'Laporan tetap tersimpan',
            'description' => 'Identitas pemilik boleh dihapus tanpa menghapus histori laporan.',
            'location_text' => 'Area pengujian',
        ]);

        $user->delete();

        $this->assertNull($report->fresh()->user_id);
        $this->assertDatabaseHas('reports', ['id' => $report->id]);
    }
}
