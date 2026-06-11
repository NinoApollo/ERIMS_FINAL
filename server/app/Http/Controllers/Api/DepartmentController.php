<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function loadDepartments() {
        $departments = Department::where('tbl_departments.is_deleted', false)
            ->get();

        return response()->json([
            'departments' => $departments
        ], 200);
    }

    public function storeDepartment(Request $request) {
        $validated = $request->validate([
            'department' => ['required', 'min:3', 'max:30']
        ]);

        Department::create([
            'department' => $validated['department']
        ]);

        return response()->json([
            'message' => 'Department Successfully Saved.'
        ], 200);
    }

    public function getDepartment($departmentId) {
        $department = Department::find($departmentId);

        return response()->json([
            'department' => $department
        ], 200);
    }

    public function updateDepartment(Request $request, Department $department) {
        $validated = $request->validate([
            'department' => ['required', 'min:3', 'max:30']
        ]);

        $department->update([
                'department' => $validated['department']
        ]);

        return response()->json([
            'department' => $department,
            'message' => 'Department Successfully Updated'
        ], 200);
    }

     public function destroyDepartment(Department $department) {
        $department->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Department Successfully Deleted.'
        ], 200);
    }
}
