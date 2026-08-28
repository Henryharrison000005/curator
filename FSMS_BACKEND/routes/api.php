<?php

use App\Http\Controllers\AttendanceLogbookController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FieldApplicationController;
use App\Models\Department;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::get('/departments', function () {
    return response()->json([
        'success' => true,
        'data' => Department::orderBy('dept_name')->get(['id', 'dept_name']),
    ], 200);
});


Route::middleware(['auth.jwt'])->group(function() {
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:30,1');
Route::get('/studentGetTasks', [TaskController::class, 'studentGetTasks']);
Route::get('/getSupervisorTasks', [TaskController::class, 'supervisorTasks']);
Route::post('/storeTask', [TaskController::class, 'store']);
Route::patch('/supervisor/tasks/{task}', [TaskController::class, 'update']);
Route::get('/getStudentSettings', [StudentController::class, 'getStudentSettings']);
Route::get('/getSupervisorSettings', [SupervisorController::class, 'getSettings']);
Route::get('/getSupervisorStudents', [SupervisorController::class, 'getStudents']);
Route::get('/getInstructorSettings', [InstructorController::class, 'getSettings']);
Route::post('/changePassword', [AuthController::class, 'changePassword']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/user', [AuthController::class, 'me']);
Route::get('/getAttendance', [AttendanceLogbookController::class, 'studentAttendance']);
Route::post('/logbookStore', [AttendanceLogbookController::class, 'store']);
Route::get('/getSupervisorAttendance', [AttendanceLogbookController::class, 'getSupervisorAttendance']);
Route::patch('/updateSupervisorAttendance/{attendanceLogbook}', [AttendanceLogbookController::class, 'update']);
Route::patch('/updateUserProfile/{user}', [UserController::class, 'update']);
Route::get('/myData', [UserController::class, 'myData']);
Route::post('/deactivateAccount', [UserController::class, 'deactivate']);
Route::get('/instructor/students', [StudentController::class, 'index']);
Route::get('/instructor/departments/{department}/supervisors', [StudentController::class, 'getDepartmentSupervisors']);
Route::patch('/instructor/students/{student}', [StudentController::class, 'update']);
Route::get('/instructor/applications', [FieldApplicationController::class, 'index']);
Route::post('/instructor/applications/{application}/accept', [FieldApplicationController::class, 'accept']);
Route::post('/instructor/applications/{application}/reject', [FieldApplicationController::class, 'reject']);
});