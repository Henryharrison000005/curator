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
        Schema::create('attendance_logbooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students');
            $table->string('date');
            $table->timestamp('date_iso');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->integer('work_hours');
            $table->integer('week_no');
            $table->string('day');
            $table->text('activity');
            $table->text('location');
            $table->enum('status', ['pending', 'verified','rejected'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('supervisors');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'date']);
            $table->index(['status', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_logbooks');
    }
};
