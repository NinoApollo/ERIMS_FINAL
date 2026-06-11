<?php
// app/Models/Personnel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Personnel extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'tbl_personnels';
    protected $primaryKey = 'personnel_id';

    protected $fillable = [
        'profile_picture',
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'gender_id',
        'role_id',
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

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
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

    // Other relationships
    public function facultyRequests(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'faculty_incharge_id', 'personnel_id');
    }

    public function releasedRequests(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'released_by', 'personnel_id');
    }

    public function endorsedRequests(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'endorsed_by', 'personnel_id');
    }

    public function approvedRequests(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'approved_by', 'personnel_id');
    }
}
