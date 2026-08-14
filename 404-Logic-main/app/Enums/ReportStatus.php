<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Submitted = 'submitted';
    case Verified = 'verified';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Diterima',
            self::Verified => 'Terverifikasi',
            self::InProgress => 'Diproses',
            self::Resolved => 'Selesai',
            self::Rejected => 'Ditolak',
        };
    }

    public function isOpen(): bool
    {
        return ! in_array($this, [self::Resolved, self::Rejected], true);
    }

    public function isPubliclyVisible(): bool
    {
        return in_array($this, [self::Verified, self::InProgress, self::Resolved], true);
    }

    /** @return list<string> */
    public static function publiclyVisibleValues(): array
    {
        return [self::Verified->value, self::InProgress->value, self::Resolved->value];
    }
}
