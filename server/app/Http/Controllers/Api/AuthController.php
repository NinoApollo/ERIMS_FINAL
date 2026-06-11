<?php
// App/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use App\Models\Student;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'min:6', 'max:12'],
            'password' => ['required', 'min:6', 'max:12'],
        ]);

        // Check personnel first (Admin, Faculty, Staff, Dean)
        $account = Personnel::with('role')
            ->where('username', $validated['username'])
            ->where('is_deleted', false)
            ->first();

        $accountType = 'personnel';

        // Fall back to student
        if (!$account) {
            $account = Student::with(['course', 'yearLevel', 'department', 'gender'])
                ->where('username', $validated['username'])
                ->where('is_deleted', false)
                ->first();

            $accountType = 'student';
        }

        if (!$account || !Hash::check($validated['password'], $account->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }

        if ($account->status === 'inactive') {
            return response()->json([
                'message' => 'Your account is inactive. Please contact the administrator.'
            ], 403);
        }

        $this->formatProfilePicture($account, $accountType);

        // Revoke existing tokens
        $account->tokens()->delete();

        $token = $account->createToken('auth_token')->plainTextToken;

        $this->recordActivity($request, $account, $accountType, 'login', 'Logged in to the system.');

        return response()->json([
            'account_type' => $accountType,
            'user'         => $account,
            'token'        => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $accountType = $user instanceof Personnel ? 'personnel' : 'student';

        $this->recordActivity($request, $user, $accountType, 'logout', 'Logged out of the system.');

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged Out Successfully.'], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Personnel) {
            $user->load('role', 'gender', 'department');
            $accountType = 'personnel';
        } else {
            $user->load('course', 'yearLevel', 'department', 'gender');
            $accountType = 'student';
        }

        $this->formatProfilePicture($user, $accountType);

        return response()->json([
            'account_type' => $accountType,
            'user'         => $user,
        ], 200);
    }

    private function formatProfilePicture($account, string $accountType): void
    {
        if (!$account->profile_picture) {
            return;
        }

        $folder = $accountType === 'personnel' ? 'personnel' : 'student';
        $account->profile_picture = url("storage/public/img/{$folder}/profile_picture/" . $account->profile_picture);
    }

    private function recordActivity(Request $request, $account, string $accountType, string $action, string $description): void
    {
        ActivityLog::create([
            'student_id' => $accountType === 'student' ? $account->student_id : null,
            'personnel_id' => $accountType === 'personnel' ? $account->personnel_id : null,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
