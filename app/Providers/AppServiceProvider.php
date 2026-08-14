<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('public-read', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.public_read')
        )->by($request->ip()));

        RateLimiter::for('report-create', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.report_create')
        )->by((string) ($request->user()?->id ?? $request->ip())));

        RateLimiter::for('report-confirm', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.report_confirm')
        )->by((string) ($request->user()?->id ?? $request->ip())));

        RateLimiter::for('report-status', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.report_status_update')
        )->by((string) ($request->user()?->id ?? $request->ip())));

        RateLimiter::for('tracking-lookup', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.tracking_lookup')
        )->by($request->ip()));

        RateLimiter::for('authentication', fn (Request $request) => Limit::perMinute(
            config('urbanpulse.rate_limits.authentication')
        )->by(Str::lower(trim((string) $request->input('email'))).'|'.$request->ip()));

        RateLimiter::for('registration', fn (Request $request) => [
            Limit::perMinute(config('urbanpulse.rate_limits.authentication'))
                ->by(Str::lower(trim((string) $request->input('email'))).'|'.$request->ip()),
            Limit::perHour(config('urbanpulse.rate_limits.registration_per_hour'))
                ->by($request->ip()),
        ]);
    }
}
