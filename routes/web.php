<?php

use App\Http\Controllers\Api\ReportConfirmationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReportStatusController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CityPortalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - URBANPULSE City Intelligence Platform
|--------------------------------------------------------------------------
*/

Route::get('/', [CityPortalController::class, 'index'])->name('home');
Route::get('/city-intelligence', [CityPortalController::class, 'cityIntelligence'])->name('city-intelligence');
Route::redirect('/layanan', '/city-intelligence')->name('layanan');
Route::get('/mobilitas', [CityPortalController::class, 'mobilitas'])->name('mobilitas');
Route::get('/lingkungan', [CityPortalController::class, 'lingkungan'])->name('lingkungan');
Route::get('/laporan-warga', [CityPortalController::class, 'laporanWarga'])->name('laporan-warga');
Route::redirect('/komunitas', '/laporan-warga')->name('komunitas');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:authentication')
        ->name('login.store');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('throttle:registration')
        ->name('register.store');
});

Route::middleware(['auth', 'active'])->group(function (): void {
    Route::get('/email/verify', EmailVerificationPromptController::class)
        ->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::prefix('api')->name('api.')->group(function (): void {
    Route::get('/reports', [ReportController::class, 'index'])
        ->middleware('throttle:public-read')
        ->name('reports.index');
    Route::post('/reports', [ReportController::class, 'store'])
        ->middleware(['auth', 'active', 'throttle:report-create'])
        ->name('reports.store');
    Route::get('/reports/{report}', [ReportController::class, 'show'])
        ->middleware('throttle:tracking-lookup')
        ->missing(fn () => response()->json(['message' => 'Laporan tidak ditemukan.'], 404))
        ->name('reports.show');
    Route::post('/reports/{report}/confirm', [ReportConfirmationController::class, 'store'])
        ->middleware(['auth', 'active', 'verified', 'throttle:report-confirm'])
        ->name('reports.confirm');
    Route::patch('/reports/{report}/status', [ReportStatusController::class, 'update'])
        ->middleware(['auth', 'active', 'throttle:report-status'])
        ->name('reports.status.update');
});

// Legacy service submission stays explicitly non-persistent until its domain
// and privacy contract are approved.
Route::post('/api/layanan/ajukan', [CityPortalController::class, 'submitLayanan'])->name('api.layanan.ajukan');
