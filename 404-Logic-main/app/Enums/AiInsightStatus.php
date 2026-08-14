<?php

namespace App\Enums;

enum AiInsightStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Expired = 'expired';
}
