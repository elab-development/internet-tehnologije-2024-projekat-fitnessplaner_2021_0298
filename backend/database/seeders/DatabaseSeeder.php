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
            'name' => 'Test User 8',
            'email' => 'test8@example.com',
            'role' => 'user',
        ]);

        
        $this->call([
            WorkoutSeeder::class,
            NutritionEntrySeeder::class,
            HydrationEntrySeeder::class,
        ]);
    }
}
