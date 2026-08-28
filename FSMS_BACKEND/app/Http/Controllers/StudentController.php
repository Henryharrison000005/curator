<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Student;
use App\Models\Supervisor;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Tymon\JWTAuth\Facades\JWTAuth;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        $students = Student::with([
            'department:id,dept_name',
            'supervisor:id,full_name,department_id',
        ])->get([
            'id',
            'full_name',
            'department_id',
            'supervisor_id',
        ]);

        $departmentIds = $students->pluck('department_id')->filter()->unique()->values();
        $supervisorsByDepartment = Supervisor::whereIn('department_id', $departmentIds)
            ->orderBy('full_name')
            ->get(['id', 'full_name', 'department_id'])
            ->groupBy('department_id');

        $mappedStudents = $students->map(function (Student $student) use ($supervisorsByDepartment) {
            $availableSupervisors = $supervisorsByDepartment->get($student->department_id, collect())
                ->map(fn (Supervisor $supervisor) => [
                    'id' => $supervisor->id,
                    'full_name' => $supervisor->full_name,
                ])->values();

            return [
                'id' => $student->id,
                'full_name' => $student->full_name,
                'dept_id' => $student->department_id,
                'department_name' => $student->department?->dept_name,
                'supervisor_id' => $student->supervisor_id,
                'supervisor_name' => $student->supervisor?->full_name,
                'available_supervisors' => $availableSupervisors,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $mappedStudents,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    public function getStudentSettings(Student $student){
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->student) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to a student profile.',
            ], 403);
        }

        $studentId = $user->student->id;

        $studentDetails = Student::with([
            'user:id,username,email,phone_no,theme,language',
            'department:id,dept_name'
        ])
        ->select('id','user_id','department_id')
        ->find($studentId);

        if(!$studentDetails ){
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }
        $nameParts = explode(' ', $studentDetails['user']['username'], 2);
        $studentDetails['user']['firstname'] = $nameParts[0] ?? '';
        $studentDetails['user']['lastname']  = $nameParts[1] ?? '';
        unset($studentDetails['user']['username']);
        $studentDetails['user_id'] = $studentDetails->user_id;
        return response()->json([
            'success' => true,
            'data' =>$studentDetails
        ], 200);
       
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        $validated = $request->validated();
        $newDepartmentId = $validated['department_id'] ?? $student->department_id;
        $newSupervisorId = $validated['supervisor_id'] ?? $student->supervisor_id;
        $departmentChanged = array_key_exists('department_id', $validated) && $newDepartmentId !== $student->department_id;

        if ($departmentChanged && !array_key_exists('supervisor_id', $validated)) {
            $newSupervisorId = null;

        }

        if ($newSupervisorId) {
            $supervisor = Supervisor::find($newSupervisorId);
            if (!$supervisor) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected supervisor does not exist.',
                ], 422);
            }
            if ($supervisor->department_id !== $newDepartmentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected supervisor does not belong to the selected department.',
                ], 422);
            }
        }

        $student->update([
            'department_id' => $newDepartmentId,
            'supervisor_id' => $newSupervisorId,
        ]);

        $student->load([
            'department:id,dept_name',
            'supervisor:id,full_name',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student assignment updated successfully.',
            'data' => [
                'id' => $student->id,
                'full_name' => $student->full_name,
                'dept_id' => $student->department_id,
                'department_name' => $student->department?->dept_name,
                'supervisor_id' => $student->supervisor_id,
                'supervisor_name' => $student->supervisor?->full_name,
            ],
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
    }

    public function getDepartmentSupervisors(Department $department)
    {
        $authError = $this->ensureInstructor();
        if ($authError) {
            return $authError;
        }

        $supervisors = Supervisor::where('department_id', $department->id)
            ->orderBy('full_name')
            ->get(['id', 'full_name'])
            ->map(fn (Supervisor $supervisor) => [
                'id' => $supervisor->id,
                'full_name' => $supervisor->full_name,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'dept_id' => $department->id,
                'department_name' => $department->dept_name,
                'supervisors' => $supervisors,
            ],
        ], 200);
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
