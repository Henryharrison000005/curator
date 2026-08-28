<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;
    protected $fillable =[
        'dept_code',
        'dept_name'
    ];

    public function student():HasMany{
        return $this->hasMany(Student::class);
    }

    public function supervisor():HasMany{
        return $this->hasMany(Supervisor::class);
    }
     public function fieldApplication():HasMany{
        return $this->hasMany(FieldApplication::class);
    }


}
