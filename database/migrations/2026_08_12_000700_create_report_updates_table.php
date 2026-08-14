<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('update_type', 24)->default('status');
            $table->string('from_status', 32)->nullable();
            $table->string('to_status', 32)->nullable();
            $table->text('note')->nullable();
            $table->boolean('is_public')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['report_id', 'created_at']);
            $table->index(['actor_user_id', 'created_at']);
            $table->index(['report_id', 'is_public', 'created_at'], 'report_updates_public_timeline_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_updates');
    }
};
