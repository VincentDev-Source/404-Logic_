<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('regions')->restrictOnDelete();
            $table->string('code', 50)->unique();
            $table->string('name', 150);
            $table->string('type', 32);
            $table->decimal('area_sq_km', 12, 3)->nullable();
            $table->decimal('center_latitude', 10, 7)->nullable();
            $table->decimal('center_longitude', 11, 7)->nullable();
            $table->json('boundary_geojson')->nullable();
            $table->decimal('bbox_min_latitude', 10, 7)->nullable();
            $table->decimal('bbox_max_latitude', 10, 7)->nullable();
            $table->decimal('bbox_min_longitude', 11, 7)->nullable();
            $table->decimal('bbox_max_longitude', 11, 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_demo')->default(false);
            $table->timestamp('boundary_updated_at')->nullable();
            $table->timestamps();

            $table->index(['parent_id', 'type']);
            $table->index(['type', 'is_active']);
            $table->index(['center_latitude', 'center_longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
