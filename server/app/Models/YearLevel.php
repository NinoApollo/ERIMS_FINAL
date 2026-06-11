<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class YearLevel extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_year_levels';
    protected $primaryKey = 'year_level_id';
    protected $fillable = [
        'year_level',
        'is_deleted',
    ];

    public function students(): HasMany {
        return $this->hasMany(Student::class, 'year_level_id', 'year_level_id');
    }
}
