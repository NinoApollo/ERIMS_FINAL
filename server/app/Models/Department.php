<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Department extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_departments';
    protected $primaryKey = 'department_id';
    protected $fillable = [
        'department',
        'is_deleted',
    ];

    public function personnels(): HasMany {
        return $this->hasMany(Personnel::class, 'department_id', 'department_id');
    }
}
