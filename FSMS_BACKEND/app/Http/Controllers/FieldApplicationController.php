<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\FieldApplication;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class FieldApplicationController extends Controller
{
    public function index()
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        $applications = FieldApplication::with([
            'department:id,dept_name',
            'user:id,username,email,phone_no,is_active',
        ])
            ->orderBy('submission_date', 'desc')
            ->get();

        $mapped = $applications->map(function (FieldApplication $application) {
            return [
                'id' => $application->id,
                'full_name' => $application->full_name,
                'email' => $application->email,
                'college' => $application->college,
                'age' => $application->age,
                'gender' => $application->gender,
                'citizenship' => $application->citizenship,
                'department_id' => $application->department_id,
                'department_name' => $application->department?->dept_name,
                'field_start_date' => $application->field_start_date,
                'field_end_date' => $application->field_end_date,
                'application_status' => $application->application_status,
                'submission_date' => $application->submission_date,
                'user_id' => $application->user_id,
                'username' => $application->user?->username,
                'phone_no' => $application->user?->phone_no,
                'is_active' => $application->user?->is_active,
            ];
        })->values();

        $pending = $mapped->where('application_status', 'pending')->values();

        return response()->json([
            'success' => true,
            'data' => $mapped,
            'pending_count' => $pending->count(),
        ], 200);
    }

    public function accept(Request $request, FieldApplication $application)
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        if ($application->application_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending applications can be accepted.',
            ], 422);
        }

        if ($application->user && $application->user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This application has already been activated.',
            ], 422);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'supervisor_id' => 'required|integer|exists:supervisors,id',
            'field_start_date' => 'nullable|date',
            'field_end_date' => 'nullable|date|after_or_equal:field_start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $departmentId = $application->department_id;
        $supervisor = Supervisor::find($request->supervisor_id);
        if (!$supervisor || (int) $supervisor->department_id !== (int) $departmentId) {
            return response()->json([
                'success' => false,
                'message' => 'The selected supervisor does not belong to the application department.',
            ], 422);
        }

        $instructor = JWTAuth::parseToken()->authenticate();
        $defaultPassword = $this->deriveDefaultPassword($application->full_name);

        try {
            DB::transaction(function () use ($application, $request, $supervisor, $departmentId, $instructor, $defaultPassword) {
                $application->update([
                    'application_status' => 'approved',
                    'reviewed_by' => $instructor->id,
                    'reviewed_at' => now(),
                    'field_start_date' => $request->field_start_date ?? $application->field_start_date,
                    'field_end_date' => $request->field_end_date ?? $application->field_end_date,
                ]);

                Student::updateOrCreate(
                    ['user_id' => $application->user_id],
                    [
                        'application_id' => $application->id,
                        'department_id' => $departmentId,
                        'supervisor_id' => $supervisor->id,
                        'full_name' => $application->full_name,
                        'college' => $application->college,
                        'age' => $application->age,
                        'gender' => $application->gender,
                        'citizenship' => $application->citizenship,
                        'field_start_date' => $application->field_start_date,
                        'field_end_date' => $application->field_end_date,
                    ]
                );

                if ($application->user) {
                    $application->user->update([
                        'is_active' => true,
                        'role' => 'student',
                        'password' => Hash::make($defaultPassword),
                    ]);
                }
            });
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept application: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Application accepted. Student account activated with default password.',
            'default_password' => $defaultPassword,
            'data' => [
                'id' => $application->id,
                'status' => 'approved',
                'supervisor_id' => $supervisor->id,
                'supervisor_name' => $supervisor->full_name,
            ],
        ], 200);
    }

    public function reject(Request $request, FieldApplication $application)
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        if ($application->application_status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending applications can be rejected.',
            ], 422);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $instructor = JWTAuth::parseToken()->authenticate();
        $application->update([
            'application_status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by' => $instructor->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application rejected.',
            'data' => [
                'id' => $application->id,
                'status' => 'rejected',
            ],
        ], 200);
    }

    public function getAllDepartments()
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        $departments = Department::orderBy('dept_name')
            ->get(['id', 'dept_name']);

        return response()->json([
            'success' => true,
            'data' => $departments,
        ], 200);
    }

    private function deriveDefaultPassword(string $fullName): string
    {
        $parts = preg_split('/\s+/', trim($fullName));
        $surname = end($parts);
        return strtoupper($surname ?: 'STUDENT');
    }

    private function ensureInstructor()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token is invalid or expired.',
            ], 401);
        }

        if (!$user || $user->role !== 'instructor') {
            return response()->json([
                'success' => false,
                'message' => 'Only instructors can perform this action.',
            ], 403);
        }

        return null;
    }
}
