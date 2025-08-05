<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Workout;
use App\Models\User;

class WorkoutFactory extends Factory
{
    protected $model = Workout::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'title' => $this->faker->sentence(3),
            'workout_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'day' => $this->faker->dayOfWeek,
            'duration' => $this->faker->numberBetween(15, 120),
            'coach_id' => null,
        ];
    }
}

