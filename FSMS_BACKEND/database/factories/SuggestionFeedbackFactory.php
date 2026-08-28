<?php

namespace Database\Factories;
use App\Models\Student;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SuggestionFeedback>
 */
class SuggestionFeedbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::inRandomOrder()->first()->id,
            'subject' => fake()->sentence(2),
            'message' => fake()->paragraph(),
            'submitted_at' =>now(),
            'is_read' => fake()->boolean(65),
        ];
    }
}
