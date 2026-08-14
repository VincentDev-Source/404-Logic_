<?php

namespace App\Http\Requests\Report;

use App\Enums\PriorityLevel;
use App\Enums\ReportCategory;
use App\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexReportsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'region_id' => ['sometimes', 'integer', 'exists:regions,id'],
            'category' => ['sometimes', Rule::enum(ReportCategory::class)],
            'status' => ['sometimes', Rule::enum(ReportStatus::class)],
            'priority' => ['sometimes', Rule::enum(PriorityLevel::class)],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }
}
