<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportUpdateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'type' => $this->update_type->value,
            'from_status' => $this->from_status?->value,
            'to_status' => $this->to_status?->value,
            'status_label' => $this->to_status?->label(),
            'note' => $this->note,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
