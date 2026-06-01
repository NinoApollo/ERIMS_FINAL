<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laboratory;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
{
    public function loadLaboratories() {
        $laboratories = Laboratory::with('course')
            ->where('is_deleted', false)
            ->get();

        return response()->json([
            'laboratories' => $laboratories
        ], 200);
    }

    public function storeLaboratory(Request $request) {
        $validated = $request->validate([
            'laboratory' => ['required', 'min:3', 'max:20'],
            'course_id' => ['required', 'exists:tbl_courses,course_id'],
        ]);

        $laboratory = Laboratory::create([
            'laboratory' => $validated['laboratory'],
            'course_id' => $validated['course_id'],
        ]);

        return response()->json([
            'message' => 'Laboratory Successfully Saved.',
            'laboratory' => $laboratory->load('course')
        ], 200);
    }

    public function getLaboratory($laboratoryId) {
        $laboratory = Laboratory::with('course')->find($laboratoryId);

        return response()->json([
            'laboratory' => $laboratory
        ], 200);
    }

    public function updateLaboratory(Request $request, Laboratory $laboratory) {
        $validated = $request->validate([
            'laboratory' => ['required', 'min:3', 'max:20'],
            'course_id' => ['required', 'exists:tbl_courses,course_id'],
        ]);

        $laboratory->update([
            'laboratory' => $validated['laboratory'],
            'course_id' => $validated['course_id'],
        ]);

        return response()->json([
            'laboratory' => $laboratory->load('course'),
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
