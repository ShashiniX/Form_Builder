<?php

namespace App\Http\Controllers;

use App\Models\FormSubmission;
use Illuminate\Http\Request;

class FormSubmissionController extends Controller
{
    public function store(Request $request, $formId)
    {
        $validated = $request->validate([
            'data' => 'required|array',
        ]);

        $submission = FormSubmission::create([
            'form_id' => $formId,
            'data' => $validated['data'],
        ]);

        return response()->json($submission, 201);
    }

    public function index($formId)
    {
        return FormSubmission::where('form_id', $formId)->get();
    }

    public function allSubmissions()
    {
        $submissions = FormSubmission::with('form')->get();

        $data = $submissions->map(function($sub) {
            return [
                'id' => $sub->id,
                'form_title' => $sub->form->title ?? 'Unknown Form',
                'data' => $sub->data,
            ];
        });

        return response()->json($data);
    }

}