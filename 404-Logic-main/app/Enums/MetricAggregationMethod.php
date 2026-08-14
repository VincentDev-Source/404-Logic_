<?php

namespace App\Enums;

enum MetricAggregationMethod: string
{
    case Average = 'average';
    case Sum = 'sum';
    case Minimum = 'min';
    case Maximum = 'max';
    case Latest = 'latest';
}
