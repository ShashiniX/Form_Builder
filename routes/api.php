<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\FormSubmissionController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/forms', [FormController::class, 'store']);
Route::get('/forms', [FormController::class, 'index']); 


Route::post('/forms/{formId}/submissions', [FormSubmissionController::class, 'store']);
Route::get('/forms/{formId}/submissions', [FormSubmissionController::class, 'index']);
Route::get('/submissions', [FormSubmissionController::class, 'allSubmissions']);