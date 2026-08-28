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
        Schema::create('email_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_email');
            $table->string('subject');
            $table->text('body');
            $table->enum('notification_type', ['application_approved', 'application_rejected', 'general', 'field_ends']);
            $table->foreignId('related_application_id')->nullable()->constrained('field_applications');
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');

            $table->index(['recipient_email', 'sent_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_notifications');
    }
};
