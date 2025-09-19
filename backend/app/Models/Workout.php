<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'workout_date', 'duration', 'day', 'coach_id', 'exercises'];
    
    protected $casts = [
        'exercises' => 'array',
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function coach()
{
    return $this->belongsTo(User::class, 'coach_id');
}

}
