<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isActive()) {
            return $next($request);
        }

        if ($request->user()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Akun tidak aktif.'], 403);
        }

        return redirect()->route('login')->withErrors([
            'email' => 'Akun tidak aktif.',
        ]);
    }
}
