<!DOCTYPE html>
<html lang="id" class="h-full scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard Kota | URBANPULSE')</title>
    <meta name="description" content="@yield('meta_description', 'URBANPULSE menghubungkan data kota, kesiapan analisis, dan laporan warga dengan provenance yang jelas.')">
    <meta name="login-url" content="{{ route('login') }}">
    <meta name="reports-url" content="{{ url('/api/reports') }}">

    @fonts
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full text-slate-800 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">

    <!-- Grain overlay for texture -->
    <div class="grain-overlay" aria-hidden="true"></div>

    <!-- Skip link for keyboard/screen reader users -->
    <a href="#main-content" class="skip-to-content">Lompati ke Konten Utama</a>

    <!-- Main Navigation Header -->
    @sectionMissing('minimal_layout')
        @include('components.navbar')
    @endif

    <!-- Main Content Outlet -->
    <main id="main-content" class="flex-1 focus:outline-none relative z-[2]" tabindex="-1">
        @yield('content')
    </main>

    <!-- Global Modals & Notifications -->
    @include('components.modals')
    @include('components.toast')

    <!-- Accessible Site Footer -->
    @sectionMissing('minimal_layout')
        @include('components.footer')
    @endif

    <button type="button" class="scroll-top-btn" aria-label="Kembali ke atas" id="scroll-top" tabindex="-1" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
    </button>

</body>
</html>
