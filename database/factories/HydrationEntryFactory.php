<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\HydrationEntry;

class HydrationEntryFactory extends Factory
{
    protected $model = HydrationEntry::class;

    public function definition(): array
    {
        return [
            'user_id' => 1, // možeš staviti User::factory() ako želiš da praviš korisnike dinamički
            'amount_ml' => $this->faker->randomElement([250, 500, 750, 1000]),
            'entry_date' => $this->faker->dateTimeBetween('-7 days', 'now')->format('Y-m-d'),
        ];
    }
}

