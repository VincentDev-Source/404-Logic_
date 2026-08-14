<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table): void {
            $table->string('public_title', 160)->nullable()->after('description');
            $table->text('public_summary')->nullable()->after('public_title');
            $table->index('user_id');
        });

        Schema::table('ai_insights', function (Blueprint $table): void {
            $table->index('city_metric_id');
            $table->index('report_id');
            $table->index('city_score_id');
            $table->index('reviewed_by_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('ai_insights', function (Blueprint $table): void {
            $table->dropIndex(['city_metric_id']);
            $table->dropIndex(['report_id']);
            $table->dropIndex(['city_score_id']);
            $table->dropIndex(['reviewed_by_user_id']);
        });

        Schema::table('reports', function (Blueprint $table): void {
            $table->dropIndex(['user_id']);
            $table->dropColumn(['public_title', 'public_summary']);
        });
    }
};
