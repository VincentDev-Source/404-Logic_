<?php

namespace App\Http\Requests\Report;

use App\Enums\ReportStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('report')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ReportStatus::class)],
            'note' => ['nullable', 'string', 'max:2000'],
            'severity' => ['nullable', 'integer', 'between:1,5'],
            'public_title' => ['nullable', 'string', 'max:160'],
            'public_summary' => ['nullable', 'string', 'min:10', 'max:1000'],
        ];
    }
}
