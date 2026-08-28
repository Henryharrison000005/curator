<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{
    /** @use HasFactory<\Database\Factories\SupervisorFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'full_name',
        'assigned_by',
    ];

    public function department():BelongsTo{
        return $this->belongsTo(Department::class, 'department_id');   
    }

    public function user():BelongsTo{
        return $this->belongsTo(User::class,'user_id');
    }

     public function student():HasMany{
        return $this->hasMany(Student::class);
    }




}
