<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceLogbook extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceLogbookFactory> */
    use HasFactory;

    public function student():BelongsTo{
        return $this->belongsTo(Student::class,'student_id');
    }

    protected $fillable = [
        'student_id',
        'date',
        'date_iso',
        'work_hours',
        'week_no',
        'day',
        'activity',
        'location',
        'status',
        'verified_by',
        'verified_at'
    ];

    protected $hidden = [
        'student'
    ];
    
}
