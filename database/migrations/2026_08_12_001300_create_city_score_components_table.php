<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_score_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_score_id')->constrained()->cascadeOnDelete();
            $table->string('category', 40);
            $table->decimal('normalized_score', 5, 2)->nullable();
            $table->decimal('weight', 6, 5);
            $table->decimal('weighted_score', 5, 2)->nullable();
            $table->unsignedSmallInteger('metric_count')->default(0);
            $table->decimal('data_completeness_percent', 5, 2)->default(0);
            $table->json('input_snapshot');
            $table->text('explanation')->nullable();
            $table->timestamps();

            $table->unique(['city_score_id', 'category']);
            $table->index(['category', 'normalized_score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_score_components');
    }
};
