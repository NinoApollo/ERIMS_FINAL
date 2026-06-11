<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestForm;
use App\Models\Equipment;
use App\Models\Student;
use App\Models\Personnel;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RequestFormController extends Controller
{
    public function loadRequestForms(Request $request): JsonResponse
    {
        try {
            $search = $request->input('search', '');
            $normalizedSearch = str_replace(' ', '_', strtolower((string) $search));
            $status = $request->input('status', '');
            $requestType = $request->input('request_type', '');
            $perPage = $request->input('per_page', 15);

            $requestForms = RequestForm::with([
                'requestor',
                'laboratory',
                'area',
                'course',
                'facultyIncharge',
                'releasedBy',
                'endorsedBy',
                'approvedBy',
            ])
            ->where('tbl_request_forms.is_deleted', false)
            ->when($search, function ($query) use ($search, $normalizedSearch) {
                $query->where('request_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('purpose', 'like', "%{$search}%")
                    ->orWhere('requestor_id', 'like', "%{$search}%")
                    ->orWhere('laboratory_id', 'like', "%{$search}%")
                    ->orWhere('request_type', 'like', "%{$search}%")
                    ->orWhere('request_type', 'like', "%{$normalizedSearch}%")
                    ->orWhere('date_of_use', 'like', "%{$search}%")
                    ->orWhereRaw("DATE_FORMAT(date_of_use, '%b %e, %Y') LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("DATE_FORMAT(date_of_use, '%M %e, %Y') LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("DATE_FORMAT(date_of_use, '%m/%d/%Y') LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("DATE_FORMAT(date_of_use, '%c/%e/%Y') LIKE ?", ["%{$search}%"])
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('laboratory', function ($q) use ($search) {
                        $q->where('laboratory', 'like', "%{$search}%");
                    })
                    ->orWhereHasMorph('requestor', [Student::class, Personnel::class], function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('middle_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('suffix_name', 'like', "%{$search}%");
                    });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($requestType, function ($query) use ($requestType) {
                $query->where('request_type', $requestType);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

            return response()->json([
                'success' => true,
                'request_forms' => $requestForms
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load request forms',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeRequestForm(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'requestor_id' => ['required', 'integer'],
                'requestor_type' => ['required', 'in:student,personnel'],
                'laboratory_id' => ['required', 'exists:tbl_laboratories,laboratory_id'],
                'area_id' => ['nullable', 'exists:tbl_areas,area_id'],
                'course_id' => ['nullable', 'exists:tbl_courses,course_id'],
                'faculty_incharge_id' => ['nullable', 'exists:tbl_personnels,personnel_id'],
                'subject' => ['nullable', 'string', 'max:100'],
                'purpose' => ['required', 'string', 'min:3'],
                'request_type' => ['required', 'in:borrow,maintenance,repair,release'],
                'request_date' => ['required', 'date'],
                'date_of_use' => ['required', 'date', 'after_or_equal:today'],
                'time_of_use' => ['required', 'date_format:H:i'],
                'expected_return_date' => ['nullable', 'date', 'after_or_equal:date_of_use'],
                'remarks' => ['nullable', 'string'],
                'items' => ['required', 'array', 'min:1'],
                'items.*.equipment_id' => ['required', 'exists:tbl_equipments,equipment_id'],
                'items.*.quantity' => ['required', 'integer', 'min:1'],
                'items.*.unit' => ['required', 'in:pcs,set,unit'],
                'items.*.remarks' => ['nullable', 'string'],
            ]);

            // Verify requestor exists
            $requestor = null;
            if ($validated['requestor_type'] === 'student') {
                $requestor = Student::find($validated['requestor_id']);
            } else {
                $requestor = Personnel::find($validated['requestor_id']);
            }

            if (!$requestor) {
                throw new \Exception("Requestor not found");
            }

            $requestedEquipments = collect($validated['items'])->map(function ($item) {
                return [
                    'equipment_id' => (int)$item['equipment_id'],
                    'quantity' => (int)$item['quantity'],
                    'unit' => $item['unit'],
                    'remarks' => $item['remarks'] ?? null,
                ];
            })->toArray();

            foreach ($requestedEquipments as $item) {
                $equipment = Equipment::find($item['equipment_id']);
                if (!$equipment) {
                    throw new \Exception("Equipment not found: ID {$item['equipment_id']}");
                }
                if ($equipment->status !== 'available') {
                    throw new \Exception("Equipment '{$equipment->equipment_name}' is not available for request");
                }
                if ($equipment->available_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient quantity for '{$equipment->equipment_name}'. Available: {$equipment->available_quantity}, Requested: {$item['quantity']}");
                }
            }

            $requestForm = RequestForm::create([
                'request_number' => $this->generateRequestNumber(),
                'requestor_id' => $validated['requestor_id'],
                'requestor_type' => $validated['requestor_type'],
                'laboratory_id' => $validated['laboratory_id'],
                'area_id' => $validated['area_id'] ?? null,
                'course_id' => $validated['course_id'] ?? null,
                'faculty_incharge_id' => $validated['faculty_incharge_id'] ?? null,
                'subject' => $validated['subject'] ?? null,
                'purpose' => $validated['purpose'],
                'request_type' => $validated['request_type'],
                'request_date' => $validated['request_date'],
                'date_of_use' => $validated['date_of_use'],
                'time_of_use' => $validated['time_of_use'],
                'expected_return_date' => $validated['expected_return_date'] ?? null,
                'remarks' => $validated['remarks'] ?? null,
                'requested_equipments' => $requestedEquipments,
                'status' => 'pending',
            ]);

            $this->recordActivity(
                $request,
                'create',
                "Created request form {$requestForm->request_number}.",
                $requestForm->request_id
            );

            DB::commit();

            $requestForm->load(['laboratory', 'area', 'course', 'requestor']);

            return response()->json([
                'success' => true,
                'message' => 'Request Form Successfully Saved.',
                'request_form' => $requestForm,
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getRequestForm(int $requestId): JsonResponse
    {
        try {
            $requestForm = RequestForm::with([
                'requestor',
                'laboratory',
                'area',
                'course',
                'facultyIncharge',
                'releasedBy',
                'endorsedBy',
                'approvedBy',
            ])
            ->where('is_deleted', false)
            ->findOrFail($requestId);

            return response()->json([
                'success' => true,
                'request_form' => $requestForm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Request form not found',
            ], 404);
        }
    }

    public function updateRequestForm(Request $request, RequestForm $requestForm): JsonResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'area_id' => ['nullable', 'exists:tbl_areas,area_id'],
                'course_id' => ['nullable', 'exists:tbl_courses,course_id'],
                'faculty_incharge_id' => ['nullable', 'exists:tbl_personnels,personnel_id'],
                'subject' => ['nullable', 'string', 'max:100'],
                'purpose' => ['sometimes', 'required', 'string'],
                'request_type' => ['sometimes', 'required', 'in:borrow,maintenance,repair,release'],
                'request_date' => ['sometimes', 'required', 'date'],
                'date_of_use' => ['sometimes', 'required', 'date'],
                'time_of_use' => ['sometimes', 'required', 'date_format:H:i'],
                'expected_return_date' => ['nullable', 'date'],
                'actual_return_date' => ['nullable', 'date'],
                'remarks' => ['nullable', 'string'],
                'items' => ['sometimes', 'array', 'min:1'],
                'items.*.equipment_id' => ['required_with:items', 'exists:tbl_equipments,equipment_id'],
                'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
                'items.*.unit' => ['required_with:items', 'in:pcs,set,unit'],
                'items.*.remarks' => ['nullable', 'string'],
            ]);

            if (isset($validated['items'])) {
                $requestedEquipments = collect($validated['items'])->map(function ($item) {
                    return [
                        'equipment_id' => (int)$item['equipment_id'],
                        'quantity' => (int)$item['quantity'],
                        'unit' => $item['unit'],
                        'remarks' => $item['remarks'] ?? null,
                    ];
                })->toArray();

                $validated['requested_equipments'] = $requestedEquipments;
                unset($validated['items']);
            }

            $requestForm->update($validated);

            $this->recordActivity(
                $request,
                'update',
                "Updated request form {$requestForm->request_number}.",
                $requestForm->request_id
            );

            DB::commit();

            $requestForm->load(['laboratory', 'area', 'course', 'requestor']);

            return response()->json([
                'success' => true,
                'message' => 'Request Form Successfully Updated.',
                'request_form' => $requestForm,
            ], 200);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update request form: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateRequestFormStatus(Request $request, RequestForm $requestForm): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => ['required', 'in:pending,approved,rejected,ongoing,completed,cancelled'],
                'released_by' => ['nullable', 'exists:tbl_personnels,personnel_id'],
                'endorsed_by' => ['nullable', 'exists:tbl_personnels,personnel_id'],
                'approved_by' => ['nullable', 'exists:tbl_personnels,personnel_id'],
                'remarks' => ['nullable', 'string'],
            ]);

            $timestamps = [];
            if (!empty($validated['endorsed_by'])) $timestamps['endorsed_at'] = now();
            if (!empty($validated['approved_by'])) $timestamps['approved_at'] = now();
            if (!empty($validated['released_by'])) $timestamps['released_at'] = now();

            if ($validated['status'] === 'completed') {
                $timestamps['actual_return_date'] = now()->toDateString();
            }

            $requestForm->update(array_merge($validated, $timestamps));
            $requestForm->load(['endorsedBy', 'approvedBy', 'releasedBy']);

            $this->recordActivity(
                $request,
                'update_status',
                "Changed request form {$requestForm->request_number} status to {$validated['status']}.",
                $requestForm->request_id
            );

            return response()->json([
                'success' => true,
                'message' => 'Request Form Status Successfully Updated.',
                'request_form' => $requestForm,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroyRequestForm(Request $request, RequestForm $requestForm): JsonResponse
    {
        try {
            $requestForm->update(['is_deleted' => true]);

            $this->recordActivity(
                $request,
                'delete',
                "Deleted request form {$requestForm->request_number}.",
                $requestForm->request_id
            );

            return response()->json([
                'success' => true,
                'message' => 'Request Form Successfully Deleted.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete request form: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function generateRequestNumber(): string
    {
        $year = now()->year;
        $count = RequestForm::whereYear('created_at', $year)->count();
        $nextNumber = str_pad($count + 1, 5, '0', STR_PAD_LEFT);
        return "RF-{$year}-{$nextNumber}";
    }

    private function recordActivity(Request $request, string $action, string $description, ?int $requestId = null): void
    {
        $user = $request->user();

        ActivityLog::create([
            'student_id' => $user instanceof Student ? $user->student_id : null,
            'personnel_id' => $user instanceof Personnel ? $user->personnel_id : null,
            'request_id' => $requestId,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
