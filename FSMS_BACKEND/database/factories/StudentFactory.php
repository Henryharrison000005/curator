<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\FieldApplication;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Keep denormalized student.full_name aligned with users.username for the linked user.
     * Default user_id creates a dedicated student user when none is passed (e.g. Student::factory()->create()).
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Student $student) {
            $student->loadMissing('user');
            if ($student->user !== null) {
                $student->forceFill([
                    'full_name' => $student->user->username,
                ])->saveQuietly();
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'application_id' => FieldApplication::inRandomOrder()->first()->id,
            'department_id' => Department::inRandomOrder()->first()->id,
            'full_name' => fake()->name(null),
            'college' => fake()->company(),
            'age' => fake()->numberBetween(18, 30),
            'gender' =>fake()->randomElement(['male', 'female']),
            'citizenship' => fake()->country(),
            'field_start_date' => now(),
            'field_end_date' => now()->addMonths(3),
            'supervisor_id' => Supervisor::inRandomOrder()->first()->id

        ];
    }
}
