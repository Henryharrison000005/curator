<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldApplication extends Model
{
    /** @use HasFactory<\Database\Factories\FieldApplicationFactory> */
    use HasFactory;
    protected $fillable =[
        'user_id',
        'full_name',
        'email',
        'college',
        'age',
        'gender',
        'department_id',
        'citizenship',
        'request_letter_url',
        'field_start_date',
        'field_end_date',
        'application_status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
        'submission_date',
    ];
    public function department():BelongsTo{
        return $this->belongsTo(Department::class, 'department_id');
    }
    public function user():BelongsTo{
        return $this->belongsTo(User::class,'user_id');
    }

    public function emailNotification():HasOne{
        return $this->hasOne(EmailNotification::class, 'related_application_id');
    }

     public function student():HasOne{
        return $this->hasOne(Student::class, 'application_id');
    }
}
