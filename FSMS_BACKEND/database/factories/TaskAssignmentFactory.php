<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskAssignment>
 */
class TaskAssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => Task::inRandomOrder()->first()->id,
            'student_id' => Student::inRandomOrder()->first()->id,
            'status' =>fake()->randomElement(['not_started', 'in_progress', 'completed']),
            'completed_at' => fake()->dateTimeBetween('now', '+1 month'),
        ];
    }
}
