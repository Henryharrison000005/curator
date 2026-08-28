<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Student;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Supervisor;
use Tymon\JWTAuth\Facades\JWTAuth;
class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $authError = $this->ensureSupervisor();
        if ($authError) {
            return $authError;
        }

        $user = JWTAuth::parseToken()->authenticate();
        $supervisor = Supervisor::where('user_id', $user->id)->first();

        if (!$supervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Supervisor profile not found for this user.',
            ], 404);
        }

        $validated = $request->validated();
        $validated['created_by'] = $supervisor->id;

        // Tasks must belong to the supervisor's own department.
        $validated['department_id'] = $supervisor->department_id;

        $validated['student_ids'] = Student::whereIn('id', $validated['student_ids'] ?? [])
            ->where('supervisor_id', $supervisor->id)
            ->pluck('id')
            ->values()
            ->all();

        $task = Task::create([
            'task_title' => $validated['task_title'],
            'task_description' => $validated['task_description'],
            'department_id' => $validated['department_id'],
            'created_by' => $supervisor->id,
            'due_date' => $validated['due_date'] ?? null,
            'group_members' => $validated['group_members'] ?? [],
        ]);

        if (!empty($validated['student_ids'])) {
            $task->student()->attach($validated['student_ids']);
        }

        $task->load('supervisor:id,full_name', 'student:id,full_name');

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data' => $this->transformTask($task),
        ], 201);
    }

    /**
     * List all tasks created by the authenticated supervisor.
     */
    public function supervisorTasks()
    {
        $authError = $this->ensureSupervisor();
        if ($authError) {
            return $authError;
        }

        $user = JWTAuth::parseToken()->authenticate();
        $supervisor = Supervisor::where('user_id', $user->id)->first();

        if (!$supervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Supervisor profile not found for this user.',
            ], 404);
        }

        $tasks = Task::where('created_by', $supervisor->id)
            ->with('supervisor:id,full_name', 'student:id,full_name')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Task $task) => $this->transformTask($task));

        return response()->json([
            'success' => true,
            'data' => $tasks,
        ], 200);
    }

    private function transformTask(Task $task)
    {
        $members = collect($task->group_members ?? [])
            ->map(fn ($name) => is_string($name) ? $name : (string) $name)
            ->values()
            ->all();

        $status = $task->student->first()?->pivot?->status;

        return [
            'id' => $task->id,
            'title' => $task->task_title,
            'description' => $task->task_description,
            'department_id' => $task->department_id,
            'assignedBy' => $task->supervisor?->full_name,
            'dueDate' => $task->due_date,
            'members' => $members,
            'student_ids' => $task->student->pluck('id')->values()->all(),
            'status' => $status,
        ];
    }

    function studentGetTasks()
{
    $user = JWTAuth::parseToken()->authenticate();

    if (!$user || !$user->student) {
        return response()->json([
            'success' => false,
            'message' => 'Authenticated user is not linked to a student profile.',
        ], 403);
    }

    $studentId = $user->student->id;

    $taskLogs = Task::whereHas('student', function ($query) use ($studentId) {
        $query->where('students.id', $studentId);
    })
    ->with('supervisor:id,full_name')
    ->get()
    ->map(function ($task) use ($studentId) {
        $status = $task->student()
            ->where('students.id', $studentId)
            ->first()?->pivot?->status;

        return [
            'id' => $task->id,
            'title' => $task->task_title,
            'description' => $task->task_description,
            'assignedBy' => $task->supervisor?->full_name,
            'assignedById' => $task->created_by,
            'dueDate' => $task->due_date,
            'members' => $task->group_members, 
            'status' => $status,
        ];
    });

    

    if ($taskLogs->isEmpty()) {
        return response()->json([
            'success' => true,
            'message' => 'No tasks assigned to the student.'
        ], 200);
    }

    return response()->json([
        'success' => true,
        'data' => $taskLogs
    ], 200);
}

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $authError = $this->ensureSupervisor();
        if ($authError) {
            return $authError;
        }

        $user = JWTAuth::parseToken()->authenticate();
        $supervisor = Supervisor::where('user_id', $user->id)->first();

        if (!$supervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Supervisor profile not found for this user.',
            ], 404);
        }

        if ($task->created_by !== $supervisor->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only edit tasks assigned by you.',
            ], 403);
        }

        $validated = $request->validated();

        // Protect task integrity: authorship and department come from the supervisor.
        $validated['created_by'] = $supervisor->id;
        if (array_key_exists('department_id', $validated)) {
            $validated['department_id'] = $supervisor->department_id;
        }

        $task->update($validated);

        if (array_key_exists('student_ids', $validated)) {
            $validated['student_ids'] = Student::whereIn('id', $validated['student_ids'] ?? [])
                ->where('supervisor_id', $supervisor->id)
                ->pluck('id')
                ->values()
                ->all();

            $task->student()->sync($validated['student_ids'] ?? []);
        }

        $task->load('supervisor:id,full_name', 'student:id,full_name');

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data' => $this->transformTask($task),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }

    private function ensureSupervisor()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token is invalid or expired.',
            ], 401);
        }

        if (!$user || $user->role !== 'supervisor') {
            return response()->json([
                'success' => false,
                'message' => 'Only supervisors can perform this action.',
            ], 403);
        }

        return null;
    }
}
