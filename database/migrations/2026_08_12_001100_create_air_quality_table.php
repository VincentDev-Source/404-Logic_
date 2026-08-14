<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('air_quality', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('data_source_id')->constrained()->restrictOnDelete();
            $table->foreignId('facility_id')->nullable()->constrained()->nullOnDelete();
            $table->string('station_code', 100)->default('regional');
            $table->timestamp('observed_at');
            $table->unsignedSmallInteger('air_quality_index')->nullable();
            $table->string('index_standard', 20)->default('ISPU');
            $table->string('category', 30)->nullable();
            $table->decimal('pm25_ug_m3', 10, 3)->nullable();
            $table->decimal('pm10_ug_m3', 10, 3)->nullable();
            $table->decimal('no2_ug_m3', 10, 3)->nullable();
            $table->decimal('so2_ug_m3', 10, 3)->nullable();
            $table->decimal('co_mg_m3', 10, 3)->nullable();
            $table->decimal('o3_ug_m3', 10, 3)->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamp('ingested_at');
            $table->timestamps();

            $table->unique(
                ['data_source_id', 'region_id', 'station_code', 'observed_at'],
                'air_quality_observation_unique'
            );
            $table->index(['region_id', 'observed_at']);
            $table->index(['data_source_id', 'observed_at']);
            $table->index(['facility_id', 'observed_at']);
            $table->index(['air_quality_index', 'observed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('air_quality');
    }
};
