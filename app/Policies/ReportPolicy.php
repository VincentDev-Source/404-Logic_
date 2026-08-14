<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, Report $report): bool
    {
        return $user->isActive()
            && ($user->id === $report->user_id || $user->isOfficerOrAdmin());
    }

    public function update(User $user, Report $report): bool
    {
        return $user->isActive() && $user->isOfficerOrAdmin();
    }

    public function confirm(User $user, Report $report): bool
    {
        return $user->isActive()
            && $user->hasVerifiedEmail()
            && $user->role === UserRole::Citizen
            && $user->id !== $report->user_id
            && $report->status->isPubliclyVisible()
            && $report->status->isOpen();
    }
}
