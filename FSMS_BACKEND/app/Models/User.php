<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements JWTSubject
{

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [
            'role' => $this->role
        ];
        }
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
  

    public function systemLogs(): HasMany
{
    return $this->hasMany(SystemLog::class, 'user_id');
}


    
        public function FieldApplication():HasOne{
        return $this->hasOne(FieldApplication::class,'user_id');
    }


     public function instructor():HasOne{
        return $this->hasOne(Instructor::class,'user_id');
    }

    public function student():HasOne{
        return $this->hasOne(Student::class,'user_id');
    }

     public function supervisor():HasOne{
        return $this->hasOne(Supervisor::class,'user_id');
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'phone_no',
        'email',
        'password',
        'role',
        'is_active',
        'theme',
        'language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'systemLogs',
        'FieldApplication',
        'instructor',
        'student',
        'supervisor',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
