<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_authentication_views_use_the_expected_navigation_layouts(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertSee('class="mobile-nav-guest"', false)
            ->assertSee('class="mobile-nav-login"', false)
            ->assertSee('class="mobile-nav-register"', false);

        foreach ([route('login'), route('register')] as $route) {
            $this->get($route)
                ->assertOk()
                ->assertDontSee('id="main-header"', false)
                ->assertDontSee('class="civic-footer"', false);
        }
    }

    public function test_registration_always_creates_an_active_citizen(): void
    {
        Notification::fake();

        $response = $this->post('/register', [
            'name' => 'Warga Baru',
            'email' => ' WARGA@EXAMPLE.TEST ',
            'password' => 'aman12345',
            'password_confirmation' => 'aman12345',
            'role' => 'admin',
            'status' => 'suspended',
        ]);

        $response->assertRedirect(route('verification.notice'));
        $this->assertAuthenticated();

        $user = User::query()->where('email', 'warga@example.test')->firstOrFail();
        $this->assertSame(UserRole::Citizen, $user->role);
        $this->assertSame(UserStatus::Active, $user->status);
        $this->assertFalse($user->hasVerifiedEmail());
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_active_user_can_login_and_logout(): void
    {
        $user = User::factory()->create(['password' => 'aman12345']);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'aman12345',
        ])->assertRedirect(route('home'));

        $this->assertAuthenticatedAs($user);

        $this->post('/logout')->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_suspended_user_cannot_login(): void
    {
        $user = User::factory()->suspended()->create(['password' => 'aman12345']);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'aman12345',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_user_suspended_after_login_is_logged_out_by_active_middleware(): void
    {
        $user = User::factory()->suspended()->create();

        $this->actingAs($user)
            ->postJson('/api/reports', [])
            ->assertForbidden()
            ->assertJsonPath('message', 'Akun tidak aktif.');

        $this->assertGuest();
    }

    public function test_registration_rejects_case_variant_of_existing_email(): void
    {
        User::factory()->create(['email' => 'warga@example.test']);

        $this->post('/register', [
            'name' => 'Duplikat',
            'email' => ' WARGA@EXAMPLE.TEST ',
            'password' => 'aman12345',
            'password_confirmation' => 'aman12345',
        ])->assertSessionHasErrors('email');

        $this->assertSame(1, User::query()->where('email', 'warga@example.test')->count());
        $this->assertGuest();
    }

    public function test_user_can_verify_email_with_signed_link(): void
    {
        $user = User::factory()->unverified()->create();
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)],
        );

        $this->actingAs($user)->get($verificationUrl)->assertRedirect(route('home'));

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_registration_has_an_ip_wide_rate_limit(): void
    {
        Notification::fake();
        config()->set('urbanpulse.rate_limits.registration_per_hour', 1);

        $this->post('/register', [
            'name' => 'Warga Satu',
            'email' => 'satu@example.test',
            'password' => 'aman12345',
            'password_confirmation' => 'aman12345',
        ])->assertRedirect(route('verification.notice'));

        $this->post('/logout')->assertRedirect(route('home'));

        $this->post('/register', [
            'name' => 'Warga Dua',
            'email' => 'dua@example.test',
            'password' => 'aman12345',
            'password_confirmation' => 'aman12345',
        ])->assertTooManyRequests();
    }
}
