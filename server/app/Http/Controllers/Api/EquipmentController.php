<?php
// App/Http/Controllers/Api/EquipmentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Equipment;
use App\Models\Personnel;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EquipmentController extends Controller
{
    public function loadEquipments(Request $request)
    {
        $search = $request->input('search');
        $normalizedSearch = str_replace(' ', '_', strtolower((string) $search));

        $equipments = Equipment::with(['category', 'area'])
            ->where('tbl_equipments.is_deleted', false)
            ->orderBy('tbl_equipments.equipment_name', 'asc');

        if ($search) {
            $equipments->where(function ($query) use ($search, $normalizedSearch) {
                $query->where('tbl_equipments.equipment_name', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.equipment_code', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.serial_number', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.brand', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.model', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.status', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.status', 'like', "%{$normalizedSearch}%")
                    ->orWhere('tbl_equipments.condition', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.quantity', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.available_quantity', 'like', "%{$search}%")
                    ->orWhere('tbl_equipments.unit', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('category', 'like', "%{$search}%");
                    })
                    ->orWhereHas('area', function ($q) use ($search) {
                        $q->where('area', 'like', "%{$search}%");
                    });
            });
        }

        $equipments = $equipments->paginate(15);

        $equipments->getCollection()->transform(function ($equipment) {
            $equipment->image = $equipment->image
                ? url('storage/public/img/equipment/' . $equipment->image)
                : null;
            return $equipment;
        });

        return response()->json(['equipments' => $equipments], 200);
    }

    public function storeEquipment(Request $request)
    {
        $validated = $request->validate([
            'category_id'       => ['required', 'exists:tbl_categories,category_id'],
            'area_id'           => ['required', 'exists:tbl_areas,area_id'],
            'equipment_code'    => ['required', 'max:20', 'unique:tbl_equipments,equipment_code'],
            'equipment_name'    => ['required', 'min:3', 'max:255'],
            'brand'             => ['nullable', 'max:100'],
            'model'             => ['nullable', 'max:100'],
            'serial_number'     => ['nullable', 'max:100'],
            'description'       => ['nullable', 'string'],
            'quantity'          => ['required', 'integer', 'min:1'],
            'available_quantity'=> ['required', 'integer', 'min:0'],
            'unit'              => ['required', 'in:pcs,set,unit'],
            'purchase_date'     => ['nullable', 'date'],
            'purchase_cost'     => ['nullable', 'numeric', 'min:0'],
            'condition'         => ['required', 'in:new,good,fair,damaged'],
            'status'            => ['required', 'in:available,in_use,borrowed,maintenance,lost,returned'],
            'image'             => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'remarks'           => ['nullable', 'string'],
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/equipment', $filename);
            $validated['image'] = $filename;
        }

        $equipment = Equipment::create($validated);

        $this->recordActivity(
            $request,
            'create',
            "Created equipment {$equipment->equipment_code} - {$equipment->equipment_name}."
        );

        return response()->json([
            'message'   => 'Equipment Successfully Saved.',
            'equipment' => $equipment->load(['category', 'area']),
        ], 200);
    }

    public function getEquipment($equipmentId)
    {
        $equipment = Equipment::with(['category', 'area'])->find($equipmentId);

        if ($equipment && $equipment->image) {
            $equipment->image = url('storage/public/img/equipment/' . $equipment->image);
        }

        return response()->json(['equipment' => $equipment], 200);
    }

    public function updateEquipment(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'category_id'       => ['required', 'exists:tbl_categories,category_id'],
            'area_id'           => ['required', 'exists:tbl_areas,area_id'],
            'equipment_code'    => ['required', 'max:20', 'unique:tbl_equipments,equipment_code,' . $equipment->equipment_id . ',equipment_id'],
            'equipment_name'    => ['required', 'min:3', 'max:255'],
            'brand'             => ['nullable', 'max:100'],
            'model'             => ['nullable', 'max:100'],
            'serial_number'     => ['nullable', 'max:100'],
            'description'       => ['nullable', 'string'],
            'quantity'          => ['required', 'integer', 'min:1'],
            'available_quantity'=> ['required', 'integer', 'min:0'],
            'unit'              => ['required', 'in:pcs,set,unit'],
            'purchase_date'     => ['nullable', 'date'],
            'purchase_cost'     => ['nullable', 'numeric', 'min:0'],
            'condition'         => ['required', 'in:new,good,fair,damaged'],
            'status'            => ['required', 'in:available,in_use,borrowed,maintenance,lost,returned'],
            'image'             => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'remove_image'      => ['nullable', 'in:0,1'],
            'remarks'           => ['nullable', 'string'],
        ]);

        if ($request->input('remove_image') == '1') {
            if ($equipment->image && Storage::exists('public/img/equipment/' . $equipment->image)) {
                Storage::delete('public/img/equipment/' . $equipment->image);
            }
            $validated['image'] = null;
        } elseif ($request->hasFile('image')) {
            if ($equipment->image && Storage::exists('public/img/equipment/' . $equipment->image)) {
                Storage::delete('public/img/equipment/' . $equipment->image);
            }
            $file = $request->file('image');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/equipment', $filename);
            $validated['image'] = $filename;
        } else {
            $validated['image'] = $equipment->image;
        }

        $equipment->update($validated);

        $this->recordActivity(
            $request,
            'update',
            "Updated equipment {$equipment->equipment_code} - {$equipment->equipment_name}."
        );

        $equipment->image = $equipment->image
            ? url('storage/public/img/equipment/' . $equipment->image)
            : null;

        return response()->json([
            'message'   => 'Equipment Successfully Updated.',
            'equipment' => $equipment->load(['category', 'area']),
        ], 200);
    }

    public function destroyEquipment(Request $request, Equipment $equipment)
    {
        $equipment->update(['is_deleted' => true]);

        $this->recordActivity(
            $request,
            'delete',
            "Deleted equipment {$equipment->equipment_code} - {$equipment->equipment_name}."
        );

        return response()->json(['message' => 'Equipment Successfully Deleted.'], 200);
    }

    private function recordActivity(Request $request, string $action, string $description): void
    {
        $user = $request->user();

        ActivityLog::create([
            'student_id' => $user instanceof Student ? $user->student_id : null,
            'personnel_id' => $user instanceof Personnel ? $user->personnel_id : null,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
