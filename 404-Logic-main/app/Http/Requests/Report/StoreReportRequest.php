<?php

namespace App\Http\Requests\Report;

use App\Enums\ReportCategory;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Report::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'region_id' => ['sometimes', 'integer', 'exists:regions,id'],
            'category' => ['required', Rule::enum(ReportCategory::class)],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'min:10', 'max:3000'],
            'address' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
            'occurred_at' => ['nullable', 'date', 'before_or_equal:now'],
        ];
    }
}
