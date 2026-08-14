<?php

namespace App\Enums;

enum UserRole: string
{
    case Citizen = 'citizen';
    case Officer = 'officer';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Citizen => 'Warga',
            self::Officer => 'Petugas',
            self::Admin => 'Administrator',
        };
    }
}
