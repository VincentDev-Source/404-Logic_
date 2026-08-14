@extends('layouts.app')

@section('title', 'Masuk - URBANPULSE')
@section('minimal_layout', 'true')

@section('content')
<section class="min-h-[70vh] px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p class="city-kicker city-kicker--ink">Akun URBANPULSE</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-950">Masuk ke platform</h1>
        <p class="mt-2 text-sm text-slate-600">Masuk untuk membuat dan mengonfirmasi laporan warga.</p>

        @if ($errors->any())
            <div class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.store') }}" class="mt-6 space-y-5">
            @csrf
            <div>
                <label for="email" class="mb-1.5 block text-sm font-bold text-slate-700">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus autocomplete="email" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
            </div>
            <div>
                <label for="password" class="mb-1.5 block text-sm font-bold text-slate-700">Kata sandi</label>
                <input id="password" name="password" type="password" required autocomplete="current-password" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
            </div>
            <label class="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="remember" value="1" class="rounded border-slate-300"> Ingat saya
            </label>
            <button type="submit" class="button button--signal w-full">Masuk</button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">Belum punya akun? <a href="{{ route('register') }}" class="font-bold text-emerald-700 hover:underline">Daftar sebagai warga</a></p>
    </div>
</section>
@endsection
