<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
            'task_title' => ['sometimes', 'required', 'string', 'max:255'],
            'task_description' => ['sometimes', 'required', 'string'],
            'department_id' => ['sometimes', 'required', 'integer', 'exists:departments,id'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'group_members' => ['sometimes', 'nullable', 'array'],
            'group_members.*' => ['string', 'max:255'],
            'student_ids' => ['nullable', 'array'],
            'student_ids.*' => ['integer', 'exists:students,id'],
        ];
    }
}
