@extends('layouts.app')

@section('title', 'Verifikasi Email - URBANPULSE')

@section('content')
<section class="min-h-[70vh] px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p class="city-kicker city-kicker--ink">Keamanan akun</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-950">Verifikasi email Anda</h1>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
            Tautan verifikasi telah dikirim ke email Anda. Verifikasi diperlukan sebelum Anda dapat mengonfirmasi laporan warga lain.
        </p>

        @if (session('status') === 'verification-link-sent')
            <div class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">
                Tautan verifikasi baru telah dikirim.
            </div>
        @endif

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <form method="POST" action="{{ route('verification.send') }}" class="flex-1">
                @csrf
                <button type="submit" class="button button--signal w-full">Kirim ulang tautan</button>
            </form>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Keluar</button>
            </form>
        </div>
    </div>
</section>
@endsection
