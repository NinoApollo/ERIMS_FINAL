<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
{
    public function loadLaboratories() {
        $laboratories = Laboratory::where('tbl_laboratories.is_deleted', false)
            ->get();

        return response()->json([
            'laboratories' => $laboratories
        ], 200);
    }

    public function storeLaboratory(Request $request) {
        $validated = $request->validate([
            'laboratory' => ['required', 'min:3', 'max:30']
        ]);

        Laboratory::create([
            'laboratory' => $validated['laboratory']
        ]);

        return response()->json([
            'message' => 'Laboratory Successfully Saved.'
        ], 200);
    }

    public function getLaboratory($laboratoryId) {
        $laboratory = Laboratory::find($laboratoryId);

        return response()->json([
            'laboratory' => $laboratory
        ], 200);
    }

    public function updateLaboratory(Request $request, Laboratory $laboratory) {
        $validated = $request->validate([
            'laboratory' => ['required', 'min:3', 'max:30']
        ]);

        $laboratory->update([
                'laboratory' => $validated['laboratory']
        ]);

        return response()->json([
            'laboratory' => $laboratory,
            'message' => 'Laboratory Successfully Updated'
        ], 200);
    }

     public function destroyLaboratory(Laboratory $laboratory) {
        $laboratory->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Laboratory Successfully Deleted.'
        ], 200);
    }
}
