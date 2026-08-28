<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Department;
use App\Models\Instructor;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supervisor>
 */
class SupervisorFactory extends Factory
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
            'department_id' => Department::inRandomOrder()->first()->id,
            'full_name' => fake()->name(null),
            'assigned_by' => User::inRandomOrder()->first()->id
        ];
    }
}
