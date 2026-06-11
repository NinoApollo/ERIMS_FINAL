<?php
// App/Http/Controllers/Api/StudentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function loadStudents(Request $request)
    {
        $search = $request->input('search');

        $students = Student::with(['gender', 'course', 'yearLevel', 'department'])
            ->leftJoin('tbl_courses', 'tbl_students.course_id', '=', 'tbl_courses.course_id')
            ->leftJoin('tbl_year_levels', 'tbl_students.year_level_id', '=', 'tbl_year_levels.year_level_id')
            ->leftJoin('tbl_departments', 'tbl_students.department_id', '=', 'tbl_departments.department_id')
            ->where('tbl_students.is_deleted', false)
            ->orderBy('tbl_students.last_name', 'asc')
            ->orderBy('tbl_students.first_name', 'asc')
            ->orderBy('tbl_students.middle_name', 'asc');

        if ($search) {
            $students->where(function ($query) use ($search) {
                $query->where('tbl_students.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_students.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_students.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_students.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_courses.course', 'like', "%{$search}%")
                    ->orWhere('tbl_year_levels.year_level', 'like', "%{$search}%")
                    ->orWhere('tbl_departments.department', 'like', "%{$search}%");
            });
        }

        $students = $students->paginate(15);

        $students->getCollection()->transform(function ($student) {
            $student->profile_picture = $student->profile_picture
                ? url('storage/public/img/student/profile_picture/' . $student->profile_picture)
                : null;
            return $student;
        });

        return response()->json(['students' => $students], 200);
    }

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'add_profile_picture'   => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'            => ['required', 'max:55'],
            'middle_name'           => ['nullable', 'max:55'],
            'last_name'             => ['required', 'max:55'],
            'suffix_name'           => ['nullable', 'max:55'],
            'gender'                => ['required', 'exists:tbl_genders,gender_id'],
            'course'                => ['required', 'exists:tbl_courses,course_id'],
            'year_level'            => ['required', 'exists:tbl_year_levels,year_level_id'],
            'department'            => ['required', 'exists:tbl_departments,department_id'],
            'birth_date'            => ['required', 'date'],
            'username'              => ['required', 'min:6', 'max:12', Rule::unique('tbl_students', 'username')],
            'password'              => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required'],
        ]);

        if ($request->hasFile('add_profile_picture')) {
            $file = $request->file('add_profile_picture');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/student/profile_picture', $filename);
            $validated['add_profile_picture'] = $filename;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        Student::create([
            'profile_picture' => $validated['add_profile_picture'] ?? null,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'gender_id'       => $validated['gender'],
            'course_id'       => $validated['course'],
            'year_level_id'   => $validated['year_level'],
            'department_id'   => $validated['department'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
            'password'        => $validated['password'],
        ]);

        return response()->json(['message' => 'Student Successfully Saved.'], 200);
    }

    public function getStudent($studentId)
    {
        $student = Student::with(['gender', 'course', 'yearLevel', 'department'])
            ->where('is_deleted', false)
            ->find($studentId);

        if ($student && $student->profile_picture) {
            $student->profile_picture = url('storage/public/img/student/profile_picture/' . $student->profile_picture);
        }

        return response()->json(['student' => $student], 200);
    }

    public function updateStudent(Request $request, Student $student)
    {
        $validated = $request->validate([
            'edit_profile_picture'  => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'            => ['required', 'string', 'max:55'],
            'middle_name'           => ['nullable', 'string', 'max:55'],
            'last_name'             => ['required', 'string', 'max:55'],
            'suffix_name'           => ['nullable', 'string', 'max:55'],
            'gender'                => ['required', 'exists:tbl_genders,gender_id'],
            'course'                => ['required', 'exists:tbl_courses,course_id'],
            'year_level'            => ['required', 'exists:tbl_year_levels,year_level_id'],
            'department'            => ['required', 'exists:tbl_departments,department_id'],
            'birth_date'            => ['required', 'date'],
            'username'              => ['required', 'min:6', 'max:12', Rule::unique('tbl_students', 'username')->ignore($student->student_id, 'student_id')],
        ]);

        if ($request->input('remove_profile_picture') == '1') {
            if ($student->profile_picture && Storage::exists('public/img/student/profile_picture/' . $student->profile_picture)) {
                Storage::delete('public/img/student/profile_picture/' . $student->profile_picture);
            }
            $validated['edit_profile_picture'] = null;
        } elseif ($request->hasFile('edit_profile_picture')) {
            if ($student->profile_picture && Storage::exists('public/img/student/profile_picture/' . $student->profile_picture)) {
                Storage::delete('public/img/student/profile_picture/' . $student->profile_picture);
            }
            $file = $request->file('edit_profile_picture');
            $filename = sha1(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_' . time() . '.' . $file->getClientOriginalExtension());
            $file->storeAs('public/img/student/profile_picture', $filename);
            $validated['edit_profile_picture'] = $filename;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $student->update([
            'profile_picture' => $validated['edit_profile_picture'] ?? $student->profile_picture,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'gender_id'       => $validated['gender'],
            'course_id'       => $validated['course'],
            'year_level_id'   => $validated['year_level'],
            'department_id'   => $validated['department'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
        ]);

        $student->profile_picture = $student->profile_picture
            ? url('storage/public/img/student/profile_picture/' . $student->profile_picture)
            : null;

        return response()->json([
            'message' => 'Student Successfully Updated.',
            'student' => $student->load(['gender', 'course', 'yearLevel', 'department']),
        ], 200);
    }

    public function destroyStudent(Student $student)
    {
        $student->update(['is_deleted' => true]);

        return response()->json(['message' => 'Student Successfully Deleted.'], 200);
    }
}
