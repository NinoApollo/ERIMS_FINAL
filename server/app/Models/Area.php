<?php
// app/Models/Area.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Area extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_areas';
    protected $primaryKey = 'area_id';

    protected $fillable = [
        'area',
        'is_deleted',
    ];

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class, 'area_id', 'area_id');
    }

    public function requestForms(): HasMany
    {
        return $this->hasMany(RequestForm::class, 'area_id', 'area_id');
    }
}
