<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\AttendanceLogbook;
use App\Models\StudentDocument;
use App\Models\SuggestionFeedback;
use App\Http\Requests\UpdateUserRequest;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function myData()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $data = [
            'account' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'phone_no' => $user->phone_no,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'theme' => $user->theme,
                'language' => $user->language,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ];

        switch ($user->role) {
            case 'student':
                $student = $user->student;
                $data['profile'] = $student;
                $data['attendance'] = $student
                    ? AttendanceLogbook::where('student_id', $student->id)->get()
                    : [];
                $data['documents'] = $student
                    ? StudentDocument::where('student_id', $student->id)->get()
                    : [];
                $data['feedback'] = $student
                    ? SuggestionFeedback::where('student_id', $student->id)->get()
                    : [];
                $taskIds = $student
                    ? \DB::table('task_assignments')->where('student_id', $student->id)->pluck('task_id')
                    : collect();
                $data['tasks'] = Task::whereIn('id', $taskIds)->get();
                break;

            case 'supervisor':
                $supervisor = $user->supervisor;
                $data['profile'] = $supervisor;
                $data['students'] = $supervisor ? $supervisor->student : [];
                $data['tasks'] = $supervisor
                    ? Task::where('created_by', $supervisor->id)->get()
                    : [];
                break;

            case 'instructor':
                $instructor = $user->instructor;
                $data['profile'] = $instructor;
                break;
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    public function deactivate()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $user->update(['is_active' => false]);

        try {
            JWTAuth::parseToken()->invalidate();
        } catch (\Throwable $th) {
            // token may already be invalid; ignore
        }

        return response()->json([
            'success' => true,
            'message' => 'Account deactivated successfully.',
        ], 200);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $authenticated = JWTAuth::parseToken()->authenticate();

        if (!$authenticated || $authenticated->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own profile.',
            ], 403);
        }

        $user->update($request->validated());
    
        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user->fresh()
        ], 200);
    }
}
