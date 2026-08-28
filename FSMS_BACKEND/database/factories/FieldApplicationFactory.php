<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Department;
use App\Models\Instructor;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FieldApplication>
 */
class FieldApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
           'department_id' => Department::inRandomOrder()->first()->id,
            'college' => fake()->company(),
            'age' => fake()->numberBetween(18, 30),
            'gender' =>fake()->randomElement(['male', 'female']),
            'citizenship' => fake()->country(),
            'field_start_date' => now(),
            'field_end_date' => now()->addMonths(3),
            'request_letter_url' => fake()->url(),
            'application_status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'submission_date' =>now(),
            'reviewed_at' => now(),
            'reviewed_by' => User::inRandomOrder()->first()->id,
            'rejection_reason' => fake()->sentence(),
        ];
    }
}
