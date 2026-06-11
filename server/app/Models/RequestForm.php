<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Notifications\Notifiable;

class RequestForm extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_request_forms';
    protected $primaryKey = 'request_id';

    protected $fillable = [
        'request_number',
        'requestor_id',
        'requestor_type',
        'laboratory_id',
        'area_id',
        'course_id',
        'faculty_incharge_id',
        'released_by',
        'endorsed_by',
        'approved_by',
        'subject',
        'purpose',
        'request_type',
        'status',
        'requested_equipments',
        'request_date',
        'date_of_use',
        'time_of_use',
        'expected_return_date',
        'actual_return_date',
        'endorsed_at',
        'approved_at',
        'released_at',
        'remarks',
        'is_deleted',
    ];

    protected $casts = [
        'requested_equipments' => 'array',
        'request_date' => 'date',
        'date_of_use' => 'date',
        'expected_return_date' => 'date',
        'actual_return_date' => 'date',
        'endorsed_at' => 'datetime',
        'approved_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    // Polymorphic relationship for requestor
    public function requestor(): MorphTo
    {
        return $this->morphTo('requestor', 'requestor_type', 'requestor_id');
    }

    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class, 'laboratory_id', 'laboratory_id');
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    public function facultyIncharge(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'faculty_incharge_id', 'personnel_id');
    }

    public function releasedBy(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'released_by', 'personnel_id');
    }

    public function endorsedBy(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'endorsed_by', 'personnel_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'approved_by', 'personnel_id');
    }

    public function getEquipmentItemsAttribute()
    {
        if (!$this->requested_equipments) {
            return [];
        }

        $equipmentIds = collect($this->requested_equipments)->pluck('equipment_id')->toArray();
        $equipments = Equipment::whereIn('equipment_id', $equipmentIds)->get()->keyBy('equipment_id');

        return collect($this->requested_equipments)->map(function ($item) use ($equipments) {
            $equipment = $equipments->get($item['equipment_id']);
            return (object)[
                'equipment_id' => $item['equipment_id'],
                'equipment_name' => $equipment ? $equipment->equipment_name : null,
                'equipment_code' => $equipment ? $equipment->equipment_code : null,
                'quantity' => $item['quantity'],
                'unit' => $item['unit'],
                'remarks' => $item['remarks'] ?? null,
            ];
        });
    }

    public function getItemsAttribute()
    {
        return $this->equipment_items;
    }
}
