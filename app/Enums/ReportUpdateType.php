<?php

namespace App\Enums;

enum ReportUpdateType: string
{
    case Status = 'status';
    case Note = 'note';
    case Assignment = 'assignment';
    case System = 'system';
}
