<?php

namespace Database\Factories;

use Carbon\Carbon;
use App\Models\Student;
use App\Models\Supervisor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceLogbook>
 */
class AttendanceLogbookFactory extends Factory
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
            'date' => fake()->date(),
            'date_iso' => Carbon::parse(fake()->date())->toISOString(),
            'time_in' => fake()->time(),
            'work_hours' => fake()->numberBetween(0,23),
            'week_no' => fake()->numberBetween(1,26),
            'day' => fake()->dayOfWeek(),
            'time_out' => fake()->time(), //work to be done
            'status' => fake()->randomElement(['pending','verified','rejected']),
            'activity' => fake()->paragraph(4),
            'location' => fake()->latitude(). "," . fake()->longitude(),
            'verified_at' => now()->addWeeks(1),
            'verified_by' => Supervisor::inRandomOrder()->first()->id,
            
        ];
    }
}
