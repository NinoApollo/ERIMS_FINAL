<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
}
