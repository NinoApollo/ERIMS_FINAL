<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function storeRole(Request $request) {
        $validated = $request->validate([
            'role' => ['required', 'min:3', 'max:30']
        ]);

        Role::create([
            'role' => $validated['role']
        ]);

        return response()->json([
            'message' => 'Role Successfully Saved.'
        ], 200);
    }
}
