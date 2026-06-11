<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\YearLevel;
use Illuminate\Http\Request;

class YearLevelController extends Controller
{
    public function loadYearLevels() {
        $yearLevels = YearLevel::where('tbl_year_levels.is_deleted', false)
            ->get();

        return response()->json([
            'yearLevels' => $yearLevels
        ], 200);
    }

    public function storeYearLevel(Request $request) {
        $validated = $request->validate([
            'year_level' => ['required', 'min:1', 'max:15']
        ]);

        YearLevel::create([
            'year_level' => $validated['year_level']
        ]);

        return response()->json([
            'message' => 'Year Level Successfully Saved.'
        ], 200);
    }

    public function getYearLevel($yearLevelId) {
        $yearLevel = YearLevel::find($yearLevelId);

        return response()->json([
            'yearLevel' => $yearLevel
        ], 200);
    }

    public function updateYearLevel(Request $request, YearLevel $yearLevel) {
        $validated = $request->validate([
            'year_level' => ['required', 'min:1', 'max:15']
        ]);

        $yearLevel->update([
                'year_level' => $validated['year_level']
        ]);

        return response()->json([
            'yearLevel' => $yearLevel,
            'message' => 'Year Level Successfully Updated'
        ], 200);
    }

     public function destroyYearLevel(YearLevel $yearLevel) {
        $yearLevel->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Year Level Successfully Deleted.'
        ], 200);
    }
}
