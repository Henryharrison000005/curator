<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Student;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentDocument>
 */
class StudentDocumentFactory extends Factory
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
            'document_name' => fake()->word(),
            'document_type' => fake()->name(),
            'document_url' => fake()->url(),
            'uploaded_at' =>now(),
            'file_size' => fake()->numberBetween(10, 50),
        ];
    }
}
