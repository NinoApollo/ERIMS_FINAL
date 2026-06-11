<?php
// app/Http/Controllers/Api/ActivityLogController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Add this import

class ActivityLogController extends Controller
{
    public function loadActivityLogs(Request $request): JsonResponse
    {
        $search = $request->input('search', '');
        $action = $request->input('action', '');
        $dateFrom = $request->input('date_from', '');
        $dateTo = $request->input('date_to', '');
        $perPage = $request->input('per_page', 15);

        $logs = ActivityLog::with(['student', 'personnel', 'requestForm'])
            ->where('tbl_activity_logs.is_deleted', false)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhereHas('student', function ($studentQuery) use ($search) {
                            $studentQuery->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        })
                        ->orWhereHas('personnel', function ($personnelQuery) use ($search) {
                            $personnelQuery->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->when($action, function ($query) use ($action) {
                $query->where('action', $action);
            })
            ->when($dateFrom, function ($query) use ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json(['activity_logs' => $logs], 200);
    }

    public function getActivityLog(int $logId): JsonResponse
    {
        $log = ActivityLog::with(['student', 'personnel', 'requestForm'])
            ->where('is_deleted', false)
            ->findOrFail($logId);

        return response()->json(['activity_log' => $log], 200);
    }

    public function getActivityStats(Request $request): JsonResponse
    {
        $stats = [
            'total_logs' => ActivityLog::where('is_deleted', false)->count(),
            'by_action' => ActivityLog::where('is_deleted', false)
                ->select('action', DB::raw('count(*) as count')) // Now DB is imported
                ->groupBy('action')
                ->get(),
            'today_logs' => ActivityLog::where('is_deleted', false)
                ->whereDate('created_at', today())
                ->count(),
            'this_week_logs' => ActivityLog::where('is_deleted', false)
                ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count(),
        ];

        return response()->json(['stats' => $stats], 200);
    }

    public function clearOldLogs(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);

        $deleted = ActivityLog::where('is_deleted', false)
            ->where('created_at', '<', now()->subDays($days))
            ->update(['is_deleted' => true]);

        return response()->json([
            'message' => "Successfully cleared {$deleted} old activity logs.",
            'deleted_count' => $deleted
        ], 200);
    }
}
