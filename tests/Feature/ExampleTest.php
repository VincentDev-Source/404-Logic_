<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\UrbanPulseDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_canonical_public_pages_have_the_correct_name_and_content(): void
    {
        $this->seed(UrbanPulseDemoSeeder::class);

        $pages = [
            '/' => ['Dashboard Kota | URBANPULSE', 'Satu pandangan untuk'],
            '/city-intelligence' => ['City Intelligence | URBANPULSE', 'Hubungkan data kota'],
            '/mobilitas' => ['Mobilitas Kota | URBANPULSE', 'Mobilitas Kota'],
            '/lingkungan' => ['Lingkungan Kota | URBANPULSE', 'Lingkungan Kota'],
            '/laporan-warga' => ['Laporan Warga | URBANPULSE', 'Laporan Warga'],
        ];

        foreach ($pages as $uri => [$title, $heading]) {
            $this->get($uri)
                ->assertOk()
                ->assertSee("<title>{$title}</title>", false)
                ->assertSee($heading)
                ->assertDontSee('Demo Dataset');
        }
    }

    public function test_legacy_page_urls_redirect_to_the_new_information_architecture(): void
    {
        $this->get('/layanan')->assertRedirect('/city-intelligence');
        $this->get('/komunitas')->assertRedirect('/laporan-warga');
    }

    public function test_public_pages_do_not_restore_the_top_bar_or_claim_unavailable_workflows(): void
    {
        $this->seed(UrbanPulseDemoSeeder::class);

        $this->get('/')
            ->assertOk()
            ->assertDontSee('class="civic-utility"', false)
            ->assertDontSee('mobile-dock')
            ->assertDontSee('mobile-account-button')
            ->assertSee('data-mobile-menu-toggle', false)
            ->assertSee('id="mobile-primary-navigation"', false)
            ->assertDontSee('Pusat layanan aktif 24/7')
            ->assertDontSee('waktu nyata');

        $this->get('/city-intelligence')->assertDontSee('Ajukan Layanan Ini');
        $this->get('/lingkungan')->assertDontSee('Jadwalkan Penjemputan');
    }

    public function test_authenticated_account_actions_remain_available_in_the_top_navigation(): void
    {
        $user = User::factory()->create(['name' => 'Warga Navigasi']);

        $this->actingAs($user)
            ->get('/')
            ->assertOk()
            ->assertSee('data-modal-target="modal-account"', false)
            ->assertSee('Warga Navigasi')
            ->assertDontSee('mobile-account-button');
    }
}
