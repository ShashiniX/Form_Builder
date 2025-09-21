<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;

class FormController extends Controller
{
    // Save form
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'string',
            'fields' => 'required|array',
        ]);

        $form = Form::create([
            'title' => $request->title,
            'fields' => $request->fields
        ]);

        return response()->json([
            'success' => true,
            'form' => $form
        ]);
    }


    // get all forms
    public function index()
    {
        $forms = Form::all();
        return response()->json($forms);
    }

}
