<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\AttendanceLogbook;
use App\Models\FieldApplication;
use App\Models\Department;
use App\Models\EmailNotification;
use App\Models\Task;
use App\Models\Instructor;
use App\Models\SystemLog;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\SuggestionFeedback;
use App\Models\Supervisor;
use App\Models\TaskAssignment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Department::factory(10)->create();
        FieldApplication::factory(10)->create();
        Supervisor::factory(10)->create();

        User::query()
            ->orderBy('id')
            ->limit(10)
            ->get()
            ->each(fn (User $user) => Student::factory()->for($user)->create());
        Task::factory(10)->create();
        AttendanceLogbook::factory(25)->create();
        StudentDocument::factory(10)->create();
        Instructor::factory(10)->create();
        TaskAssignment::factory(10)->create();
        EmailNotification::factory(10)->create();
        SuggestionFeedback::factory(10)->create();
        SystemLog::factory(10)->create();


       
    }
}
