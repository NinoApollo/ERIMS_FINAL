<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class Laboratory extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_laboratories';
    protected $primaryKey = 'laboratory_id';
    protected $fillable = [
        'laboratory',
        'course_id',
        'is_deleted',
    ];

    public function course(): BelongsTo {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
