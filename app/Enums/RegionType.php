<?php

namespace App\Enums;

enum RegionType: string
{
    case City = 'city';
    case District = 'district';
    case Subdistrict = 'subdistrict';
    case Neighborhood = 'neighborhood';
}
