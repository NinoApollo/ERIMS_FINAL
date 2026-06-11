<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Role extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_roles';
    protected $primaryKey = 'role_id';
    protected $fillable = [
        'role',
        'is_deleted',
    ];

    public function students(): HasMany {
        return $this->hasMany(Student::class, 'role_id', 'role_id');
    }

    public function personnel(): HasMany {
        return $this->hasMany(Personnel::class, 'role_id', 'role_id');
    }
}
