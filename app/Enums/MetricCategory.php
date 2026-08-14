<?php

namespace App\Enums;

enum MetricCategory: string
{
    case Environment = 'environment';
    case Mobility = 'mobility';
    case Infrastructure = 'infrastructure';
    case PublicServices = 'public_services';
    case Community = 'community';

    public function label(): string
    {
        return match ($this) {
            self::Environment => 'Lingkungan',
            self::Mobility => 'Mobilitas',
            self::Infrastructure => 'Infrastruktur',
            self::PublicServices => 'Layanan Publik',
            self::Community => 'Komunitas',
        };
    }

    public function slug(): string
    {
        return str_replace('_', '-', $this->value);
    }
}
