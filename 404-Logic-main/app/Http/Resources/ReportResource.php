<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $canViewPrivateLocation = $user
            && $user->isActive()
            && ($user->id === $this->user_id || $user->isOfficerOrAdmin());
        $canViewPublicAddress = $this->is_demo || $canViewPrivateLocation;
        $publicProjection = ! $canViewPrivateLocation && $this->status->isPubliclyVisible();
        $publicTitle = $this->public_title ?? ($this->is_demo ? $this->title : null);
        $publicSummary = $this->public_summary ?? ($this->is_demo ? $this->description : null);
        $includePublicUpdates = $this->status->isPubliclyVisible() || $canViewPrivateLocation;

        return [
            'tracking_code' => $this->tracking_code,
            'title' => $publicProjection ? $publicTitle : $this->title,
            'description' => $publicProjection ? $publicSummary : $this->description,
            'category' => [
                'code' => $this->category->value,
                'label' => $this->category->label(),
            ],
            'status' => [
                'code' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'severity' => $this->severity,
            'location' => [
                'address' => $this->when($canViewPublicAddress, $this->location_text),
                'latitude' => $this->when($canViewPrivateLocation, $this->latitude),
                'longitude' => $this->when($canViewPrivateLocation, $this->longitude),
            ],
            'region' => $this->whenLoaded('region', fn () => [
                'code' => $this->region->code,
                'name' => $this->region->name,
            ]),
            'confirmation_count' => $this->whenCounted('confirmations'),
            'priority' => $this->when($this->priority_score !== null, [
                'score' => $this->priority_score,
                'level' => $this->priority_level?->value,
                'version' => $this->priority_version,
            ]),
            'public_projection' => $this->when($canViewPrivateLocation, [
                'title' => $this->public_title,
                'summary' => $this->public_summary,
            ]),
            'updates' => $this->when(
                $includePublicUpdates,
                fn () => ReportUpdateResource::collection($this->whenLoaded('updates')),
            ),
            'is_demo' => $this->is_demo,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
