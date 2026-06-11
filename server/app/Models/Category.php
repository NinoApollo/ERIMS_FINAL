<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Category extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_categories';
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'category',
        'is_deleted',
    ];

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class, 'category_id', 'category_id');
    }
}
