<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function workouts()
    {
        return $this->hasMany(Workout::class);
    }

    public function nutritionEntries()
    {
        return $this->hasMany(NutritionEntry::class);
    }

    public function hydrationEntries()
    {
        return $this->hasMany(HydrationEntry::class);
    }

    public function trainings()
    {
        return $this->hasMany(Workout::class);
    }

    public function coachedWorkouts()
    {
        return $this->hasMany(Workout::class, 'coach_id');
    }

    // Ovo je metoda za slanje reset linka
   public function sendPasswordResetNotification($token)
{
    $this->notify(new \App\Notifications\ResetPasswordNotification($token, $this->email));
}
}
