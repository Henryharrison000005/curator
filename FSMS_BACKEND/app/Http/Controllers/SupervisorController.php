<?php

namespace App\Http\Controllers;

use App\Models\Supervisor;
use App\Models\Student;
use Tymon\JWTAuth\Facades\JWTAuth;

class SupervisorController extends Controller
{
    public function getSettings()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->supervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to a supervisor profile.',
            ], 403);
        }

        $supervisorId = $user->supervisor->id;

        $supervisorDetails = Supervisor::with([
            'user:id,username,email,phone_no,theme,language',
            'department:id,dept_name',
        ])
            ->select('id', 'user_id', 'department_id')
            ->find($supervisorId);

        if (!$supervisorDetails) {
            return response()->json([
                'success' => false,
                'message' => 'Supervisor not found.',
            ], 404);
        }

        $nameParts = explode(' ', $supervisorDetails['user']['username'], 2);
        $supervisorDetails['user']['firstname'] = $nameParts[0] ?? '';
        $supervisorDetails['user']['lastname'] = $nameParts[1] ?? '';
        unset($supervisorDetails['user']['username']);
        $supervisorDetails['user_id'] = $supervisorDetails->user_id;

        return response()->json([
            'success' => true,
            'data' => $supervisorDetails,
        ], 200);
    }

    public function getStudents()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->supervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to a supervisor profile.',
            ], 403);
        }

        $supervisorId = $user->supervisor->id;

        $students = Student::where('supervisor_id', $supervisorId)
            ->get(['id', 'full_name']);

        return response()->json([
            'success' => true,
            'data' => $students,
        ], 200);
    }
}
