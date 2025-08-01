<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        \App\Models\User::factory()->create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
        ]);

        
        $this->call([
            WorkoutSeeder::class,
            NutritionEntrySeeder::class,
            HydrationEntrySeeder::class,
        ]);
    }
}
