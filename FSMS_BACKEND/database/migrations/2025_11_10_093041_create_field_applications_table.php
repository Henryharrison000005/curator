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
        Schema::create('field_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('college');
            $table->integer('age');
            $table->enum('gender', ['male', 'female']);
            $table->foreignId('department_id')->constrained('departments');
            $table->string('citizenship');
            $table->string('request_letter_url', 500);
            $table->date('field_start_date');
            $table->date('field_end_date');
            $table->enum('application_status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->timestamp('submission_date')->useCurrent();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->index(['email', 'application_status', 'submission_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_applications');
    }
};
