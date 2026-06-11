<?php
// App/Http/Controllers/Api/PersonnelController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PersonnelController extends Controller
{
    public function loadPersonnels(Request $request)
    {
        $search = $request->input('search');

        $personnels = Personnel::with(['gender', 'role', 'department'])
            ->leftJoin('tbl_roles', 'tbl_personnels.role_id', '=', 'tbl_roles.role_id')
            ->leftJoin('tbl_departments', 'tbl_personnels.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_personnels.is_deleted', false)
            ->orderBy('tbl_personnels.last_name', 'asc')
            ->orderBy('tbl_personnels.first_name', 'asc')
            ->orderBy('tbl_personnels.middle_name', 'asc');

        if ($search) {
            $personnels->where(function ($query) use ($search) {
                $query->where('tbl_personnels.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_personnels.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_personnels.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_personnels.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_roles.role', 'like', "%{$search}%")
                    ->orWhere('tbl_departments.department', 'like', "%{$search}%")
                    ->orWhere('tbl_personnels.username', 'like', "%{$search}%")
                    ->orWhere('tbl_personnels.status', 'like', "%{$search}%");
            });
        }

        $personnels = $personnels->paginate(15);

        $personnels->getCollection()->transform(function ($personnel) {
            $personnel->profile_picture = $personnel->profile_picture
                ? url('storage/public/img/personnel/profile_picture/' . $personnel->profile_picture)
                : null;
            return $personnel;
        });

        return response()->json(['personnels' => $personnels], 200);
    }

    public function storePersonnel(Request $request)
    {
        $validated = $request->validate([
            'add_profile_picture'   => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'            => ['required', 'max:55'],
            'middle_name'           => ['nullable', 'max:55'],
            'last_name'             => ['required', 'max:55'],
            'suffix_name'           => ['nullable', 'max:55'],
            'gender'                => ['required', 'exists:tbl_genders,gender_id'],
            'role'                  => ['required', 'exists:tbl_roles,role_id'],
            'department'            => ['required', 'exists:tbl_departments,department_id'],
            'birth_date'            => ['required', 'date'],
            'username'              => ['required', 'min:6', 'max:12', Rule::unique('tbl_personnels', 'username')],
            'password'              => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required'],
        ]);

        if ($request->hasFile('add_profile_picture')) {
            $file = $request->file('add_profile_picture');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/personnel/profile_picture', $filename);
            $validated['add_profile_picture'] = $filename;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        Personnel::create([
            'profile_picture' => $validated['add_profile_picture'] ?? null,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'gender_id'       => $validated['gender'],
            'role_id'         => $validated['role'],
            'department_id'   => $validated['department'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
            'password'        => $validated['password'],
        ]);

        return response()->json(['message' => 'Personnel Successfully Saved.'], 200);
    }

    public function getPersonnel($personnelId)
    {
        $personnel = Personnel::with(['gender', 'role', 'department'])
            ->where('is_deleted', false)
            ->find($personnelId);

        if ($personnel && $personnel->profile_picture) {
            $personnel->profile_picture = url('storage/public/img/personnel/profile_picture/' . $personnel->profile_picture);
        }

        return response()->json(['personnel' => $personnel], 200);
    }

    public function updatePersonnel(Request $request, Personnel $personnel)
    {
        $validated = $request->validate([
            'edit_profile_picture'  => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'            => ['required', 'max:55'],
            'middle_name'           => ['nullable', 'max:55'],
            'last_name'             => ['required', 'max:55'],
            'suffix_name'           => ['nullable', 'max:55'],
            'gender'                => ['required', 'exists:tbl_genders,gender_id'],
            'role'                  => ['required', 'exists:tbl_roles,role_id'],
            'department'            => ['required', 'exists:tbl_departments,department_id'],
            'birth_date'            => ['required', 'date'],
            'username'              => ['required', 'min:6', 'max:12', Rule::unique('tbl_personnels', 'username')->ignore($personnel->personnel_id, 'personnel_id')],
        ]);

        if ($request->input('remove_profile_picture') == '1') {
            if ($personnel->profile_picture && Storage::exists('public/img/personnel/profile_picture/' . $personnel->profile_picture)) {
                Storage::delete('public/img/personnel/profile_picture/' . $personnel->profile_picture);
            }
            $validated['edit_profile_picture'] = null;
        } elseif ($request->hasFile('edit_profile_picture')) {
            if ($personnel->profile_picture && Storage::exists('public/img/personnel/profile_picture/' . $personnel->profile_picture)) {
                Storage::delete('public/img/personnel/profile_picture/' . $personnel->profile_picture);
            }
            $file = $request->file('edit_profile_picture');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/personnel/profile_picture', $filename);
            $validated['edit_profile_picture'] = $filename;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $personnel->update([
            'profile_picture' => $validated['edit_profile_picture'] ?? $personnel->profile_picture,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'gender_id'       => $validated['gender'],
            'role_id'         => $validated['role'],
            'department_id'   => $validated['department'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
        ]);

        $personnel->profile_picture = $personnel->profile_picture
            ? url('storage/public/img/personnel/profile_picture/' . $personnel->profile_picture)
            : null;

        return response()->json([
            'message'   => 'Personnel Successfully Updated.',
            'personnel' => $personnel->load(['gender', 'role', 'department']),
        ], 200);
    }

    public function destroyPersonnel(Personnel $personnel)
    {
        $personnel->update(['is_deleted' => true]);

        return response()->json(['message' => 'Personnel Successfully Deleted.'], 200);
    }
}
