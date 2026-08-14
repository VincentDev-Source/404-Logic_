<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('metric_definition_id')->constrained()->restrictOnDelete();
            $table->foreignId('data_source_id')->constrained()->restrictOnDelete();
            $table->string('dimension_key', 100)->default('all');
            $table->decimal('value', 18, 6);
            $table->string('unit', 40);
            $table->string('granularity', 20)->default('instant');
            $table->timestamp('observed_at');
            $table->timestamp('period_start')->nullable();
            $table->timestamp('period_end')->nullable();
            $table->string('quality_status', 20)->default('validated');
            $table->boolean('is_estimated')->default(false);
            $table->json('lineage')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('ingested_at');
            $table->timestamps();

            $table->unique(
                ['region_id', 'metric_definition_id', 'data_source_id', 'dimension_key', 'observed_at', 'granularity'],
                'city_metrics_observation_unique'
            );
            $table->index(['region_id', 'metric_definition_id', 'observed_at'], 'city_metrics_region_definition_time_index');
            $table->index(['metric_definition_id', 'observed_at']);
            $table->index(['data_source_id', 'observed_at']);
            $table->index(['region_id', 'quality_status', 'observed_at'], 'city_metrics_region_quality_time_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_metrics');
    }
};
