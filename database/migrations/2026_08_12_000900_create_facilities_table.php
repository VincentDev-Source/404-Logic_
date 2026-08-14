<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('data_source_id')->constrained()->restrictOnDelete();
            $table->string('external_id', 100)->nullable();
            $table->string('type', 50);
            $table->string('name', 180);
            $table->string('status', 24)->default('active');
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();
            $table->json('attributes')->nullable();
            $table->timestamp('source_updated_at')->nullable();
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamps();

            $table->unique(['data_source_id', 'external_id'], 'facilities_source_external_unique');
            $table->index(['region_id', 'type', 'status']);
            $table->index(['latitude', 'longitude']);
            $table->index(['data_source_id', 'source_updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
