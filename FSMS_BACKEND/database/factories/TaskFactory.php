<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Student;
use App\Models\Department;
use App\Models\Supervisor;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $students = Student::pluck('full_name')->toArray();
        return [
            'task_title' =>fake()->sentence(4),
            'task_description' =>fake()->paragraph(),
            'department_id' => Department::inRandomOrder()->first()->id,
            'created_by' => Supervisor::inRandomOrder()->first()->id,
            'due_date' => fake()->dateTimeBetween('+1 week', '+1 month'),
            'group_members' => fake()->randomElements( $students, 3),
        ];
    }
}