<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $casts = [
        'group_members' => 'array',
    ];

    protected $fillable = [
        'task_title',
        'task_description',
        'department_id',
        'created_by',
        'due_date',
        'group_members',
    ];

    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    public function department():BelongsTo{
        return $this->belongsTo(Department::class,'department_id');
    }

     public function supervisor():BelongsTo{
        return $this->belongsTo(Supervisor::class,'created_by');
    }

     public function student():BelongsToMany{
        return $this->belongsToMany(Student::class,'task_assignments','task_id','student_id');
    }


}
