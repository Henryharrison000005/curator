<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class AuthController extends Controller
{
    function register(Request $request){
         $validator = Validator::make($request->all(),[
            'username'=>'required|unique:users|string|max:255',
            'phone_no'=>'required|unique:users|string|max:15',
            'email'=>'required|unique:users|email|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'full_name'=>'required|string|max:255',
            'college'=>'required|string|max:255',
            'age'=>'required|integer|min:15|max:100',
            'gender'=>'required|in:male,female',
            'citizenship'=>'required|string|max:255',
            'department_id'=>'required|integer|exists:departments,id',
            'field_start_date'=>'required|date',
            'field_end_date'=>'required|date|after_or_equal:field_start_date',
          ]
         );

        if ($validator->fails()){
            return response()->json([
                'success'=>false,
                'errors'=>$validator->errors()
            ],422);
        }

    $user = User::create([
        'username'=>$request->username,
        'phone_no'=>$request->phone_no,
        'email'=>$request->email,
        'password'=>$request->password,
        'role' => 'student',
        'is_active'=>false

    ]);

    \App\Models\FieldApplication::create([
        'user_id' => $user->id,
        'full_name' => $request->full_name,
        'email' => $request->email,
        'college' => $request->college,
        'age' => $request->age,
        'gender' => $request->gender,
        'department_id' => $request->department_id,
        'citizenship' => $request->citizenship,
        'field_start_date' => $request->field_start_date,
        'field_end_date' => $request->field_end_date,
        'application_status' => 'pending',
        'submission_date' => now(),
    ]);

    return response()->json([
        'success'=> true,
        'message' => 'Application submitted successfully. Your account will be activated once the instructor approves your field application.',
        'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => false,
            ],
    ],201);
}

    function login(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if($validator->fails()){
            return response()->json([
                'success' =>false,
                'errors'=>$validator->errors()
            ]);
        }

        $credentials = $request->only('email', 'password');

        $existingUser = User::where('email', $credentials['email'])->first();

        if ($existingUser && !$existingUser->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact the HR office.',
            ], 403);
        }

      try{ if(! $token = JWTAuth::attempt($credentials)){
        return response()->json([
            'success' => false,
             'message' => 'Invalid email or password'
        ],401);
       }


        $user = auth()->user(); 



     return  response()->json([
        'success' => true,
        'message'=> 'user logged in successfully',
         'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
                //'expires_in' => auth()->factory()->getTTL() * 60 // in seconds
            ], 200);}

            catch(JWTException $e){
               return response()->json([
                     'success' => false,
                'message' => 'Could not create token'
                ],500);
            }
        }

    function me(Request $request){
        try{
        $user = JWTAuth::parseToken()->authenticate(); 

        if(!$user){
            return response()->json([
                'success' => false,
                'message' =>'User not found'
            ],404);
        }

        return response()->json([
            'message' => 'successfully',
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active
        ]);
    } 
    catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid or expired'
            ], 401);
        }    
    } 

    function refresh(Request $request){
        try{
            $token = JWTAuth::parseToken()->refresh();
             return response()->json([
                'success' => true,
                'token' => $token,
                'token_type' => 'Bearer',
               // 'expires_in' => auth()->factory()->getTTL() * 60 
             ],200);
        }catch(JWTException $e){
            return response()->json([
                'success' => false,
                'message'=>'could not refresh token '
            ],500);
        }    
    }

    function logout(Request $request){
        try{
            JWTAuth::parseToken()->invalidate();

             return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout, please try again'
            ], 500);
        }
    }


    function changePassword(Request $request){
        try{
            $validator = Validator::make($request->all(),[
                'current_password' => 'string|required',
                'new_password'=> 'required|string|min:8|confirmed'
            ]);
            if($validator->fails()){
                return response()->json([
                    'success' => false,
                 'errors' => $validator->errors()
                ],422);
            }

            $user = JWTAuth::parseToken()->authenticate();

            if(!Hash::check($request->current_password,$user->password)){
                return response()->json([
                    'success'=>false,
                    'message' => 'Current password is incorrect'
                ], 401);
            }

            $user->update([
            'password' => $request->new_password 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ], 200);
        } catch (JWTException $e){
            return response()->json([
                'success' => false,
                'message' => 'Could not change the Password'
            ]);
        }
    }
        
    
    }