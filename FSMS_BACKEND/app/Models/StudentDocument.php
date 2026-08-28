<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentDocument extends Model
{
    /** @use HasFactory<\Database\Factories\StudentDocumentFactory> */
    use HasFactory;

    public function student():BelongsTo{
        return $this->belongsTo(Student::class,'student_id');
    }
}
