<?php

namespace App\Http\Requests;
use Illuminate\Support\Facades\Validator;
use App\Models\AttendanceLogbook;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceLogbookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // $user = $this->user();
        // if ($user->id == request()->input('user_id') || $user)
        //     return $user->can('create', AttendanceLogbook::class);
        // else
        //     return false;
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $studentId = auth('api')->user()?->student?->id;

        $dateRule = ['required', 'date'];
        if ($studentId) {
            // A student can only have one logbook entry per date.
            $dateRule[] = 'unique:attendance_logbooks,date,NULL,id,student_id,' . $studentId;
        }

        return [
            'student_id' => 'nullable|exists:students,id',
            'date' => $dateRule,
            'date_iso' => 'required|date',
            'work_hours' => 'required|integer|min:0|max:12',
            'week_no' => 'required|integer|min:1|max:52',
            'day' => 'required|string|max:20',
            'activity' => 'required|string|max:255',
            'location.lat' => 'required|numeric',
            'location.lon' => 'required|numeric',
            'status' => 'required|string|in:"pending","verified","rejected"',
            'time_in' => 'nullable',
            'time_out' => 'nullable',
            'verified_by' => 'nullable',
            'verified_at' => 'nullable',
        ];
    }
}
