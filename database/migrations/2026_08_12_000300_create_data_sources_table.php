<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->unique();
            $table->string('name', 150);
            $table->string('type', 50);
            $table->string('provider', 150)->nullable();
            $table->string('status', 20)->default('active');
            $table->boolean('is_demo')->default(false);
            $table->string('license', 100)->nullable();
            $table->text('attribution')->nullable();
            $table->unsignedInteger('refresh_interval_minutes')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->text('last_sync_error')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index(['is_demo', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_sources');
    }
};
