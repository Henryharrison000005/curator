<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLogbook;
use App\Models\Supervisor;
use App\Models\User;
use App\Http\Requests\StoreAttendanceLogbookRequest;
use App\Http\Requests\UpdateAttendanceLogbookRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AttendanceLogbookController extends Controller
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
    public function store(StoreAttendanceLogbookRequest $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->student) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to a student profile.',
            ], 403);
        }

        $studentId = $user->student->id;

        $validated = $request->validated();
        $validated['student_id'] = $studentId;
        $validated['location'] = $request->location['lat'].','.$request->location['lon'];

        // Students may not self-verify or set their own status/metadata.
        $validated['status'] = 'pending';
        $validated['verified_by'] = null;
        $validated['verified_at'] = null;

        $entry = AttendanceLogbook::create($validated);

        return response()->json(
            [
                'success' => true,
                'message' => 'Attendance logbook created successfully.',
                'entry' => $entry,
            ],
            201
        );
    }
    /**
     * Display the specified resource.
     */
    public function show(AttendanceLogbook $attendanceLogbook)
    {
       //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceLogbook $attendanceLogbook)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceLogbookRequest $request, AttendanceLogbook $attendanceLogbook)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (! $attendanceLogbook->exists) {
            return response()->json(['success' => false, 'message' => 'Attendance record not found.'], 404);
        }

        // Only supervisors (of the record's student) or instructors may update.
        if ($user->role === 'instructor') {
            // instructors may update any record
        } elseif ($user->role === 'supervisor') {
            $supervisor = $user->supervisor;
            if (!$supervisor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authenticated user is not linked to a supervisor profile.',
                ], 403);
            }

            $isOwnStudent = $supervisor->student()
                ->where('students.id', $attendanceLogbook->student_id)
                ->exists();

            if (!$isOwnStudent) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only update attendance for your own students.',
                ], 403);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update attendance records.',
            ], 403);
        }

        $data = $request->validated();

        // Guard against mutating a record that has already been verified.
        if (($data['status'] ?? null) && $attendanceLogbook->status === 'verified' && $data['status'] !== 'verified') {
            return response()->json([
                'success' => false,
                'message' => 'A verified attendance record cannot be changed.',
            ], 422);
        }

        if (isset($data['status'])) {
            $attendanceLogbook->status = $data['status'];
        }

        // Record who verified/approved the attendance when marked verified.
        if (($data['status'] ?? null) === 'verified') {
            $attendanceLogbook->verified_by = $user->role === 'instructor'
                ? null
                : ($user->supervisor->id ?? null);
            $attendanceLogbook->verified_at = now();
        }

        $attendanceLogbook->save();

        return response()->json([
            'success' => true,
            'message' => 'Attendance logbook updated successfully.',
            'data' => $attendanceLogbook->fresh()
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceLogbook $attendanceLogbook)
    {
        //
    }

    public function studentAttendance( AttendanceLogbook $AttendanceLogbook )
    {

        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !$user->student) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not linked to a student profile.',
            ], 403);
        }

        $studentId = $user->student->id;

    $logs = AttendanceLogbook::where('student_id',$studentId)->get();
    if(!$logs){
        return response()->json([
            'success' => true,
            'message' => 'No attendance logs found for the student.'
        ], 200);
    }
    return response()->json([
        'success' => true,
        'data' => $logs
    ], 200);
}

public function getSupervisorAttendance(){
    $user = JWTAuth::parseToken()->authenticate();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated.',
        ], 401);
    }

    // Instructors may view attendance across all supervisors.
    if ($user->role === 'instructor') {
        $logs = AttendanceLogbook::query()
            ->with('student:id,full_name')
            ->get()
            ->map(function ($log) {
                $log->student_name = $log->student->full_name ?? null;
                unset($log->student);
                return $log;
            });

        if ($logs->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No attendance logs found.'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $logs
        ], 200);
    }

    // Supervisors only see their own students' attendance.
    if (!$user->supervisor) {
        return response()->json([
            'success' => false,
            'message' => 'Authenticated user is not linked to a supervisor profile.',
        ], 403);
    }

    $supervisor = $user->supervisor;

    $studentIDs = $supervisor->student()->pluck('id');

    if($studentIDs->isEmpty()){
        return response()->json([
            'success' => true,
            'message' => 'No students found for this supervisor.'
        ], 200);
    }

        $logs = AttendanceLogbook::query()
            ->whereIn('student_id', $studentIDs)
            ->with('student:id,full_name')
            ->get()
            ->map(function ($log) {
                $log->student_name = $log->student->full_name ?? null;
                unset($log->student);
                return $log;
            });

        if($logs->isEmpty()){
            return response()->json([
                'success' => true,
                'message' => 'No attendance logs found for supervisor\'s students.'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $logs
        ], 200);
}


}
