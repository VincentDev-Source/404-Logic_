<?php

namespace App\Enums;

enum CityScoreStatus: string
{
    case Provisional = 'provisional';
    case Published = 'published';
    case InsufficientData = 'insufficient_data';
}
