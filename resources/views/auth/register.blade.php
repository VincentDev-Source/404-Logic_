@extends('layouts.app')

@section('title', 'Daftar Warga - URBANPULSE')
@section('minimal_layout', 'true')

@section('content')
<section class="min-h-[70vh] px-6 py-16 sm:px-12 lg:px-24 xl:px-32">
    <div class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p class="city-kicker city-kicker--ink">Partisipasi warga</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-950">Buat akun warga</h1>
        <p class="mt-2 text-sm text-slate-600">Akun baru selalu dibuat dengan peran Citizen. Peran petugas dikelola administrator.</p>

        @if ($errors->any())
            <div class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                <ul class="list-disc space-y-1 pl-5">
                    @foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('register.store') }}" class="mt-6 space-y-5">
            @csrf
            <div>
                <label for="name" class="mb-1.5 block text-sm font-bold text-slate-700">Nama</label>
                <input id="name" name="name" value="{{ old('name') }}" required autofocus autocomplete="name" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
            </div>
            <div>
                <label for="email" class="mb-1.5 block text-sm font-bold text-slate-700">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
            </div>
            <div>
                <label for="password" class="mb-1.5 block text-sm font-bold text-slate-700">Kata sandi</label>
                <input id="password" name="password" type="password" required autocomplete="new-password" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
                <p class="mt-1 text-xs text-slate-500">Minimal 8 karakter, berisi huruf dan angka.</p>
            </div>
            <div>
                <label for="password_confirmation" class="mb-1.5 block text-sm font-bold text-slate-700">Ulangi kata sandi</label>
                <input id="password_confirmation" name="password_confirmation" type="password" required autocomplete="new-password" class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600">
            </div>
            <button type="submit" class="button button--signal w-full">Daftar</button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">Sudah punya akun? <a href="{{ route('login') }}" class="font-bold text-emerald-700 hover:underline">Masuk</a></p>
    </div>
</section>
@endsection
