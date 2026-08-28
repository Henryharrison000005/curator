<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Tymon\JWTAuth\Facades\JWTAuth;

class InstructorController extends Controller
{
    public function getSettings()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to an instructor profile.',
            ], 403);
        }

        $instructorId = $user->instructor->id;

        $instructorDetails = Instructor::with('user:id,username,email,phone_no,theme,language')
            ->select('id', 'user_id')
            ->find($instructorId);

        if (!$instructorDetails) {
            return response()->json([
                'success' => false,
                'message' => 'Instructor not found.',
            ], 404);
        }

        $nameParts = explode(' ', $instructorDetails['user']['username'], 2);
        $instructorDetails['user']['firstname'] = $nameParts[0] ?? '';
        $instructorDetails['user']['lastname'] = $nameParts[1] ?? '';
        unset($instructorDetails['user']['username']);
        $instructorDetails['user_id'] = $instructorDetails->user_id;

        return response()->json([
            'success' => true,
            'data' => $instructorDetails,
        ], 200);
    }
}
