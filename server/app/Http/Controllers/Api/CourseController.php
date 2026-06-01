<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function loadCourses() {
        $courses = Course::where('tbl_courses.is_deleted', false)
            ->get();

        return response()->json([
            'courses' => $courses
        ], 200);
    }

    public function storeCourse(Request $request) {
        $validated = $request->validate([
            'course' => ['required', 'min:3', 'max:30']
        ]);

        Course::create([
            'course' => $validated['course']
        ]);

        return response()->json([
            'message' => 'Course Successfully Saved.'
        ], 200);
    }

    public function getCourse($courseId) {
        $course = Course::find($courseId);

        return response()->json([
            'course' => $course
        ], 200);
    }

    public function updateCourse(Request $request, Course $course) {
        $validated = $request->validate([
            'course' => ['required', 'min:3', 'max:30']
        ]);

        $course->update([
                'course' => $validated['course']
        ]);

        return response()->json([
            'course' => $course,
            'message' => 'Course Successfully Updated'
        ], 200);
    }

     public function destroyCourse(Course $course) {
        $course->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Course Successfully Deleted.'
        ], 200);
    }
}
