<?php

namespace App\Enums;

enum MetricGranularity: string
{
    case Instant = 'instant';
    case Hourly = 'hourly';
    case Daily = 'daily';
    case Weekly = 'weekly';
    case Monthly = 'monthly';
}
