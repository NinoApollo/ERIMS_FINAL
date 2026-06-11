<?php
// app/Models/Equipment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class Equipment extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_equipments';
    protected $primaryKey = 'equipment_id';

    protected $fillable = [
        'category_id',
        'area_id',
        'equipment_code',
        'equipment_name',
        'brand',
        'model',
        'serial_number',
        'description',
        'quantity',
        'available_quantity',
        'unit',
        'purchase_date',
        'purchase_cost',
        'condition',
        'status',
        'image',
        'remarks',
        'is_deleted',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }

    // Accessor for image URL
    public function getImageUrlAttribute(): ?string
    {
        if ($this->image) {
            return url('storage/public/img/equipment/' . $this->image);
        }
        return null;
    }
}
