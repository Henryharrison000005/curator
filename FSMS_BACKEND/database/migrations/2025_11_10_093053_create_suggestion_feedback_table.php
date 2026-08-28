<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suggestion_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students');
            $table->string('subject');
            $table->text('message');
            $table->timestamps();
            $table->timestamp('submitted_at')->useCurrent();
            $table->boolean('is_read')->default(false);

            $table->index(['student_id', 'submitted_at', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestion_feedback');
    }
};
