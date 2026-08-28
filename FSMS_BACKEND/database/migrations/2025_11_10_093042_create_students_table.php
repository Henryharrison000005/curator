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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('application_id')->constrained('field_applications');
            $table->foreignId('department_id')->constrained('departments');
            $table->string('full_name');
            $table->string('college');
            $table->integer('age');
            $table->enum('gender', ['male', 'female']);
            $table->string('citizenship');
            $table->date('field_start_date');
            $table->date('field_end_date');
            $table->foreignId('supervisor_id')->nullable()->constrained('supervisors');
            $table->timestamps();

            $table->index(['user_id', 'department_id', 'supervisor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
