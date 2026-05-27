<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Role::factory()->createMany([
            ['role' => 'Admin'],
            ['role' => 'Faculty'],
            ['role' => 'Staff'],
            ['role' => 'Student'],
        ]);

        $birthDate = fake()->date();
        $age = date_diff(date_create($birthDate), date_create('now'))->y;

        User::factory()->create([
            'first_name' => 'Niño',
            'middle_name' => 'Rivan',
            'last_name' => 'Apollo',
            'suffix_name' => 'Wallet',
            'role_id' => Role::inRandomOrder()->first()->role_id,
            'birth_date' => $birthDate,
            'age' => $age,
            'username' => 'ninoapollo',
            'password' => 'ninoapollo'
        ]);
    }
}
