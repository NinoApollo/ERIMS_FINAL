<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function loadAreas() {
        $areas = Area::where('tbl_areas.is_deleted', false)
            ->get();

        return response()->json([
            'areas' => $areas
        ], 200);
    }

    public function storeArea(Request $request) {
        $validated = $request->validate([
            'area' => ['required', 'min:3', 'max:30']
        ]);

        Area::create([
            'area' => $validated['area']
        ]);

        return response()->json([
            'message' => 'Area Successfully Saved.'
        ], 200);
    }

    public function getArea($areaId) {
        $area = Area::find($areaId);

        return response()->json([
            'area' => $area
        ], 200);
    }

    public function updateArea(Request $request, Area $area) {
        $validated = $request->validate([
            'area' => ['required', 'min:3', 'max:30']
        ]);

        $area->update([
                'area' => $validated['area']
        ]);

        return response()->json([
            'area' => $area,
            'message' => 'Area Successfully Updated'
        ], 200);
    }

     public function destroyArea(Area $area) {
        $area->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Area Successfully Deleted.'
        ], 200);
    }
}
