<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->decimal('overall_score', 5, 2)->nullable();
            $table->timestamp('period_start');
            $table->timestamp('period_end');
            $table->string('calculation_version', 50);
            $table->json('weights_snapshot');
            $table->decimal('data_completeness_percent', 5, 2);
            $table->string('status', 24)->default('provisional');
            $table->timestamp('data_cutoff_at');
            $table->timestamp('calculated_at');
            $table->timestamps();

            $table->unique(
                ['region_id', 'period_start', 'period_end', 'calculation_version'],
                'city_scores_period_version_unique'
            );
            $table->index(['region_id', 'status', 'period_end']);
            $table->index(['region_id', 'calculated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_scores');
    }
};
