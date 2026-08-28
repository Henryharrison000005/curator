<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SystemLog>
 */
class SystemLogFactory extends Factory
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
            'action' => fake()->sentence(2),
            'entity_type' => fake()->randomElement(['create', 'update', 'delete']),
            'entity_id' => fake()->numberBetween(1, 1000),
            'ip_address' => fake()->ipv6(),

        ];
    }
}
