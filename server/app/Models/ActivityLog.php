<?php
// app/Models/ActivityLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Notifications\Notifiable;

class ActivityLog extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_activity_logs';
    protected $primaryKey = 'log_id';

    protected $fillable = [
        'student_id',
        'personnel_id',
        'request_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'is_deleted',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'personnel_id');
    }

    public function requestForm(): BelongsTo
    {
        return $this->belongsTo(RequestForm::class, 'request_id', 'request_id');
    }

    // Get the user who performed the action
    public function getUserAttribute()
    {
        if ($this->student) {
            return $this->student;
        }
        if ($this->personnel) {
            return $this->personnel;
        }
        return null;
    }

    // Get user name
    public function getUserNameAttribute(): string
    {
        if ($this->student) {
            return $this->student->full_name;
        }
        if ($this->personnel) {
            return $this->personnel->full_name;
        }
        return 'System';
    }

    // Get user type
    public function getUserTypeAttribute(): string
    {
        if ($this->student) {
            return 'student';
        }
        if ($this->personnel) {
            return 'personnel';
        }
        return 'system';
    }
}
