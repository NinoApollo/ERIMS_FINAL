<?php
// app/Models/Laboratory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Laboratory extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_laboratories';
    protected $primaryKey = 'laboratory_id';

    protected $fillable = [
        'laboratory',
        'is_deleted',
    ];

    public function requestForms(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'laboratory_id', 'laboratory_id');
    }

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class, 'area_id', 'area_id');
    }
}
