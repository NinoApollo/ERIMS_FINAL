<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Course extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_courses';
    protected $primaryKey = 'course_id';
    protected $fillable = [
        'course',
        'is_deleted',
    ];

    public function users(): HasMany {
        return $this->hasMany(User::class, 'course_id', 'course_id');
    }
}
