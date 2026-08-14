<?php

namespace App\Enums;

enum DataSourceType: string
{
    case Government = 'government';
    case Weather = 'weather';
    case Environment = 'environment';
    case Mobility = 'mobility';
    case Citizen = 'citizen';
    case Manual = 'manual';
    case Csv = 'csv';
    case RestApi = 'rest_api';
    case Derived = 'derived';
}
