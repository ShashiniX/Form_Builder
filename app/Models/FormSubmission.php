<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    protected $fillable = ['form_id', 'data'];

    protected $casts = [
        'data' => 'array', 
    ];

        // app/Models/FormSubmission.php
    public function form() {
        return $this->belongsTo(Form::class);
    }

}