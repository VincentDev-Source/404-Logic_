<?php

namespace App\Enums;

enum MetricQualityStatus: string
{
    case Pending = 'pending';
    case Validated = 'validated';
    case Rejected = 'rejected';
}
