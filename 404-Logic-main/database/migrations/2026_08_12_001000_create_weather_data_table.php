<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('data_source_id')->constrained()->restrictOnDelete();
            $table->foreignId('facility_id')->nullable()->constrained()->nullOnDelete();
            $table->string('station_code', 100)->default('regional');
            $table->timestamp('observed_at');
            $table->boolean('is_forecast')->default(false);
            $table->decimal('temperature_c', 5, 2)->nullable();
            $table->decimal('humidity_percent', 5, 2)->nullable();
            $table->decimal('rainfall_mm', 10, 2)->nullable();
            $table->decimal('wind_speed_m_s', 8, 3)->nullable();
            $table->decimal('pressure_hpa', 8, 2)->nullable();
            $table->string('condition_code', 50)->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamp('ingested_at');
            $table->timestamps();

            $table->unique(
                ['data_source_id', 'region_id', 'station_code', 'observed_at', 'is_forecast'],
                'weather_observation_unique'
            );
            $table->index(['region_id', 'observed_at']);
            $table->index(['data_source_id', 'observed_at']);
            $table->index(['facility_id', 'observed_at']);
            $table->index(['is_forecast', 'observed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_data');
    }
};
