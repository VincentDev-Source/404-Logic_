<?php

namespace App\Enums;

enum ReportCategory: string
{
    case Environment = 'environment';
    case Mobility = 'mobility';
    case Infrastructure = 'infrastructure';
    case PublicServices = 'public_services';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Environment => 'Lingkungan',
            self::Mobility => 'Mobilitas',
            self::Infrastructure => 'Infrastruktur',
            self::PublicServices => 'Layanan Publik',
            self::Other => 'Lainnya',
        };
    }
}
