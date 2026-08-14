<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('city_metric_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('report_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_score_id')->nullable()->constrained()->nullOnDelete();
            $table->char('input_hash', 64);
            $table->string('insight_type', 40);
            $table->string('title', 180);
            $table->text('summary');
            $table->json('evidence');
            $table->json('recommendations')->nullable();
            $table->string('provider', 80);
            $table->string('model', 100);
            $table->string('prompt_version', 50);
            $table->string('response_schema_version', 50);
            $table->decimal('confidence', 5, 4)->nullable();
            $table->json('input_snapshot');
            $table->string('status', 20)->default('draft');
            $table->timestamp('generated_at');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->unique(['input_hash', 'prompt_version', 'insight_type'], 'ai_insights_input_version_unique');
            $table->index(['region_id', 'status', 'generated_at']);
            $table->index(['insight_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_insights');
    }
};
