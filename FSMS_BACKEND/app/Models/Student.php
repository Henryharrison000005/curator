<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'department_id',
        'supervisor_id',
        'application_id',
        'college',
        'age',
        'gender',
        'citizenship',
        'field_start_date',
        'field_end_date',
    ];

    public function user():BelongsTo{
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supervisor():BelongsTo{
        return $this->belongsTo(Supervisor::class, 'supervisor_id');
    }

    public function attendanceLogbook():HasMany{
        return $this->hasMany( AttendanceLogbook::class);
    }

    public function fieldApplication():BelongsTo{
        return $this->belongsTo(FieldApplication::class,'application_id');
    }

     public function department():BelongsTo{
        return $this->belongsTo(Department::class,'department_id');
    }

     public function studentDocument():HasMany{
        return $this->hasMany(StudentDocument::class);
    }

        public function suggestionFeedback():HasMany{
        return $this->hasMany( SuggestionFeedback::class);
    }

      public function task():BelongsToMany{
        return $this->belongsToMany(Task::class, 'task_assignments', 'student_id', 'task_id');
    }



}
