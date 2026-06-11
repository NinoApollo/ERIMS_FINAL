<?php
// app/Models/Student.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'tbl_students';
    protected $primaryKey = 'student_id';

    protected $fillable = [
        'profile_picture',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'gender_id',
        'course_id',
        'year_level_id',
        'department_id',
        'birth_date',
        'age',
        'username',
        'password',
        'status',
        'is_deleted',
    ];

    protected $hidden = ['password'];

    protected function casts(): array {
        return ['password' => 'hashed'];
    }

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class, 'gender_id', 'gender_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    public function yearLevel(): BelongsTo
    {
        return $this->belongsTo(YearLevel::class, 'year_level_id', 'year_level_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    // THIS IS CRITICAL - The morphMany relationship for request forms
    public function requestForms(): MorphMany
    {
        return $this->morphMany(RequestForm::class, 'requestor', 'requestor_type', 'requestor_id');
    }

    public function getFullNameAttribute(): string
    {
        $name = "{$this->last_name}, {$this->first_name}";
        if ($this->middle_name) {
            $name .= " " . substr($this->middle_name, 0, 1) . ".";
        }
        if ($this->suffix_name) {
            $name .= " {$this->suffix_name}";
        }
        return $name;
    }
}
