<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metric_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->unique();
            $table->string('category', 40);
            $table->string('name', 150);
            $table->string('canonical_unit', 40);
            $table->string('aggregation_method', 24)->default('average');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['category', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metric_definitions');
    }
};
