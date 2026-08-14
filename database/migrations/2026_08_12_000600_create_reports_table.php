<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_code', 32)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category', 50);
            $table->string('status', 32)->default('submitted');
            $table->unsignedTinyInteger('severity')->nullable();
            $table->string('title', 160);
            $table->text('description');
            $table->string('location_text', 255);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();
            $table->string('evidence_path')->nullable();
            $table->timestamp('occurred_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->decimal('priority_score', 5, 2)->nullable();
            $table->string('priority_level', 16)->nullable();
            $table->string('priority_version', 50)->nullable();
            $table->json('priority_factors')->nullable();
            $table->timestamp('priority_calculated_at')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['region_id', 'status', 'created_at']);
            $table->index(['region_id', 'category', 'created_at']);
            $table->index(['assigned_to_user_id', 'status']);
            $table->index(['priority_level', 'priority_score']);
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
