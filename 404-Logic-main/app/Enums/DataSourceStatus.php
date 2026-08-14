<?php

namespace App\Enums;

enum DataSourceStatus: string
{
    case Active = 'active';
    case Paused = 'paused';
    case Error = 'error';
}
