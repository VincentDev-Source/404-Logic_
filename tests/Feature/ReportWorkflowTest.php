<?php

namespace Tests\Feature;

use App\Enums\RegionType;
use App\Enums\ReportCategory;
use App\Enums\ReportStatus;
use App\Models\Region;
use App\Models\Report;
use App\Models\ReportConfirmation;
use App\Models\ReportUpdate;
use App\Models\User;
use App\Services\Reports\ReportWorkflowService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ReportWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private Region $region;

    protected function setUp(): void
    {
        parent::setUp();

        $this->region = Region::create([
            'code' => config('urbanpulse.default_region_code'),
            'name' => 'Test Region',
            'type' => RegionType::City,
            'is_active' => true,
        ]);
    }

    public function test_guest_cannot_create_report(): void
    {
        $this->postJson('/api/reports', $this->validPayload())->assertUnauthorized();
    }

    public function test_authenticated_citizen_creates_report_and_initial_update_atomically(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/reports', $this->validPayload());

        $response->assertCreated()
            ->assertJsonPath('data.status.code', ReportStatus::Submitted->value)
            ->assertJsonPath('data.category.code', ReportCategory::Infrastructure->value)
            ->assertJsonMissingPath('data.user_id');

        $trackingCode = $response->json('data.tracking_code');
        $this->assertMatchesRegularExpression('/^UP-\d{4}-[A-F0-9]{16}$/', $trackingCode);

        $report = Report::query()->where('tracking_code', $trackingCode)->firstOrFail();
        $this->assertSame($user->id, $report->user_id);
        $this->assertSame(1, ReportUpdate::query()->where('report_id', $report->id)->count());
    }

    public function test_report_validation_rejects_invalid_category_and_partial_coordinate(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/reports', [
            ...$this->validPayload(),
            'category' => 'made_up',
            'latitude' => -6.2,
        ])->assertUnprocessable()->assertJsonValidationErrors(['category', 'longitude']);
    }

    public function test_report_detail_enforces_moderation_and_private_location_policy(): void
    {
        $owner = User::factory()->create();
        $otherCitizen = User::factory()->create();
        $officer = User::factory()->officer()->create();
        $suspendedOfficer = User::factory()->officer()->suspended()->create();
        $response = $this->actingAs($owner)->postJson('/api/reports', [
            ...$this->validPayload(),
            'latitude' => -6.2383,
            'longitude' => 106.9756,
        ])->assertCreated();

        $trackingCode = $response->json('data.tracking_code');
        $report = Report::query()->where('tracking_code', $trackingCode)->firstOrFail();

        $this->actingAs($owner)->getJson(route('api.reports.show', $report))
            ->assertOk()
            ->assertJsonPath('data.location.address', $this->validPayload()['address'])
            ->assertJsonPath('data.location.latitude', '-6.2383000')
            ->assertJsonPath('data.updates.0.note', 'Laporan diterima oleh URBANPULSE.');

        $this->actingAs($otherCitizen)
            ->getJson(route('api.reports.show', $report))
            ->assertNotFound();

        $this->actingAs($suspendedOfficer)
            ->getJson(route('api.reports.show', $report))
            ->assertNotFound();

        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $report), $this->verificationPayload())
            ->assertOk();

        $this->actingAs($suspendedOfficer)
            ->getJson(route('api.reports.show', $report))
            ->assertOk()
            ->assertJsonMissingPath('data.location.address')
            ->assertJsonMissingPath('data.location.latitude')
            ->assertJsonMissingPath('data.location.longitude');

        $this->app['auth']->forgetGuards();

        $this->getJson("/api/reports/{$trackingCode}")
            ->assertOk()
            ->assertJsonMissingPath('data.location.address')
            ->assertJsonMissingPath('data.location.latitude')
            ->assertJsonMissingPath('data.location.longitude')
            ->assertJsonMissingPath('data.user_id');

        $this->getJson('/api/reports/UP-2099-FFFFFFFFFFFFFFFF')
            ->assertNotFound()
            ->assertExactJson(['message' => 'Laporan tidak ditemukan.']);
    }

    public function test_public_feeds_only_publish_moderated_reports(): void
    {
        $owner = User::factory()->create();
        $officer = User::factory()->officer()->create();
        $privateReport = $this->createReport($owner);
        $privateReport->update(['title' => 'Laporan Belum Dimoderasi 9382']);

        $publicReport = $this->createReport($owner);
        $publicReport->update(['title' => 'Laporan Terverifikasi 4721']);
        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $publicReport), [
                ...$this->verificationPayload(),
                'public_title' => 'Ringkasan Aman Terverifikasi 4721',
                'public_summary' => 'Ringkasan publik yang sudah disunting petugas tanpa data pribadi warga.',
            ])
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $this->getJson('/api/reports')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Ringkasan Aman Terverifikasi 4721')
            ->assertJsonMissing(['Laporan Terverifikasi 4721'])
            ->assertJsonMissingPath('data.0.location.address');

        $this->get(route('laporan-warga'))
            ->assertOk()
            ->assertSee('Ringkasan Aman Terverifikasi 4721')
            ->assertDontSee('Laporan Terverifikasi 4721')
            ->assertDontSee('Laporan Belum Dimoderasi 9382');
    }

    public function test_confirmation_is_idempotent_and_author_cannot_self_confirm(): void
    {
        $owner = User::factory()->create();
        $citizen = User::factory()->create();
        $unverifiedCitizen = User::factory()->unverified()->create();
        $officer = User::factory()->officer()->create();
        $report = $this->createReport($owner);

        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $report), $this->verificationPayload())
            ->assertOk();

        $this->actingAs($owner)
            ->postJson(route('api.reports.confirm', $report))
            ->assertForbidden();

        $this->actingAs($unverifiedCitizen)
            ->postJson(route('api.reports.confirm', $report))
            ->assertForbidden();

        $this->actingAs($citizen)
            ->postJson(route('api.reports.confirm', $report))
            ->assertCreated()
            ->assertJsonPath('confirmation_count', 1);

        $this->actingAs($citizen)
            ->postJson(route('api.reports.confirm', $report))
            ->assertOk()
            ->assertJsonPath('already_confirmed', true)
            ->assertJsonPath('confirmation_count', 1);

        $this->assertSame(1, ReportConfirmation::query()->count());
    }

    public function test_only_officer_can_apply_valid_status_transition(): void
    {
        $owner = User::factory()->create();
        $officer = User::factory()->officer()->create();
        $report = $this->createReport($owner);

        $this->actingAs($owner)
            ->patchJson(route('api.reports.status.update', $report), ['status' => 'verified'])
            ->assertForbidden();

        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $report), ['status' => 'verified'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['public_title', 'public_summary']);

        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $report), [
                ...$this->verificationPayload(),
                'severity' => 4,
                'note' => 'Terverifikasi dari data uji.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status.code', 'verified');

        $this->assertSame(ReportStatus::Verified, $report->fresh()->status);
        $this->assertSame(2, $report->updates()->count());

        $this->actingAs($officer)
            ->patchJson(route('api.reports.status.update', $report), ['status' => 'resolved'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $admin = User::factory()->admin()->create();
        $secondReport = $this->createReport($owner);

        $this->actingAs($admin)
            ->patchJson(route('api.reports.status.update', $secondReport), $this->verificationPayload())
            ->assertOk()
            ->assertJsonPath('data.status.code', 'verified');
    }

    public function test_report_creation_is_rate_limited_per_user(): void
    {
        config()->set('urbanpulse.rate_limits.report_create', 2);
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/reports', $this->validPayload())->assertCreated();
        $this->actingAs($user)->postJson('/api/reports', $this->validPayload())->assertCreated();
        $this->actingAs($user)->postJson('/api/reports', $this->validPayload())->assertTooManyRequests();
    }

    public function test_stale_report_instance_cannot_bypass_current_transition_rules(): void
    {
        $owner = User::factory()->create();
        $officer = User::factory()->officer()->create();
        $staleReport = $this->createReport($owner);

        Report::query()->whereKey($staleReport->id)->update(['status' => ReportStatus::Rejected]);

        try {
            app(ReportWorkflowService::class)->updateStatus($officer, $staleReport, ['status' => 'verified']);
            $this->fail('A stale transition should have been rejected.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('status', $exception->errors());
        }

        $this->assertSame(ReportStatus::Rejected, $staleReport->fresh()->status);
        $this->assertSame(1, $staleReport->updates()->count());
    }

    public function test_confirmation_rechecks_current_status_inside_workflow(): void
    {
        $owner = User::factory()->create();
        $citizen = User::factory()->create();
        $report = $this->createReport($owner);
        $report->update([
            'status' => ReportStatus::Resolved,
            'public_title' => 'Laporan selesai',
            'public_summary' => 'Ringkasan aman untuk pengujian laporan yang telah selesai.',
        ]);
        $staleReport = $report->fresh();
        Report::query()->whereKey($report->id)->update(['status' => ReportStatus::Rejected]);

        try {
            app(ReportWorkflowService::class)->confirm($citizen, $staleReport);
            $this->fail('A confirmation against a newly closed report should have been rejected.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('report', $exception->errors());
        }

        $this->assertSame(0, ReportConfirmation::query()->count());
    }

    private function createReport(User $owner): Report
    {
        $response = $this->actingAs($owner)->postJson('/api/reports', $this->validPayload());
        $response->assertCreated();

        return Report::query()->where('tracking_code', $response->json('data.tracking_code'))->firstOrFail();
    }

    private function validPayload(): array
    {
        return [
            'region_id' => $this->region->id,
            'category' => ReportCategory::Infrastructure->value,
            'title' => 'Drainase tersumbat',
            'description' => 'Air tidak mengalir dan menggenangi sisi jalan setelah hujan.',
            'address' => 'Koridor Barat, dekat taman kota',
        ];
    }

    private function verificationPayload(): array
    {
        return [
            'status' => 'verified',
            'public_title' => 'Laporan fasilitas kota terverifikasi',
            'public_summary' => 'Ringkasan publik telah disunting petugas dan tidak memuat data pribadi.',
        ];
    }
}
