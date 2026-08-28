<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\FieldApplication;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmailNotification>
 */
class EmailNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'recipient_email' => fake()->unique()->safeEmail(),
            'subject' => fake()->sentence(),
            'body' => fake()->paragraph(),
            'sent_at' => now(),
            'status' => fake()->randomElement(['sent', 'failed', 'pending']),
            'notification_type' => fake()->randomElement(['application_approved','application_rejected','general','field_ends']),
            'related_application_id' => FieldApplication::inRandomOrder()->first()->id,

        ];
    }
}
