<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\NutritionEntry;

class NutritionEntryFactory extends Factory
{
    protected $model = NutritionEntry::class;

    public function definition(): array
    {
        return [
            'user_id' => 1, // ili User::factory() ako hoćeš da praviš korisnike dinamički
            'meal_type' => $this->faker->randomElement(['doručak', 'ručak', 'večera']),
            'calories' => $this->faker->numberBetween(100, 1000),
            'entry_date' => $this->faker->date('Y-m-d'),
        ];
    }
}

