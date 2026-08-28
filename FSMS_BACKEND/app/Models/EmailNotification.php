<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailNotification extends Model
{
    /** @use HasFactory<\Database\Factories\EmailNotificationFactory> */
    use HasFactory;
    public function fieldApplication():BelongsTo{
        return $this->belongsTo(FieldApplication::class,'related_application_id');
    }
}
