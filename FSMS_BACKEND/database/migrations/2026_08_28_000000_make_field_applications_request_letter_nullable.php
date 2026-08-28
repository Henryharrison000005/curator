<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('field_applications', function (Blueprint $table) {
            $table->string('request_letter_url', 500)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('field_applications', function (Blueprint $table) {
            $table->string('request_letter_url', 500)->nullable(false)->change();
        });
    }
};
