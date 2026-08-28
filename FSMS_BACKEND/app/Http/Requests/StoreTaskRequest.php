<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'task_title' => ['required', 'string', 'max:255'],
            'task_description' => ['required', 'string'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'due_date' => ['nullable', 'date'],
            'group_members' => ['nullable', 'array'],
            'group_members.*' => ['string', 'max:255'],
            'student_ids' => ['nullable', 'array'],
            'student_ids.*' => ['integer', 'exists:students,id'],
        ];
    }
}
