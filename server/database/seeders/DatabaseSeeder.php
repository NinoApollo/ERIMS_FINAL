<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Department;
use App\Models\Gender;
use App\Models\Personnel;
use App\Models\Role;
use App\Models\Student;
use App\Models\YearLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Lookup / reference tables ─────────────────────────────────────
        Role::factory()->createMany([
            ['role' => 'Admin'],
            ['role' => 'Faculty'],
            ['role' => 'Staff'],
            ['role' => 'Dean'],
        ]);

        Gender::factory()->createMany([
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Prefer not to say'],
        ]);

        Course::factory()->createMany([
            ['course' => 'BSCS'],
            ['course' => 'BSIT'],
            ['course' => 'BSBA'],
            ['course' => 'BPED'],
        ]);

        YearLevel::factory()->createMany([
            ['year_level' => '1st Year'],
            ['year_level' => '2nd Year'],
            ['year_level' => '3rd Year'],
            ['year_level' => '4th Year'],
        ]);

        Department::factory()->createMany([
            ['department' => 'CCS Dept.'],
            ['department' => 'CBA Dept.'],
            ['department' => 'CTE Dept.'],
            ['department' => 'CAS Dept.'],
        ]);

        // ── Personnel (Admin / Faculty / Staff / Dean) ────────────────────
        $adminRole = Role::where('role', 'Admin')->first();

        $birthDate = fake()->date();
        $age       = date_diff(date_create($birthDate), date_create('now'))->y;

        // Guaranteed admin account
        Personnel::create([
            'first_name'    => 'John',
            'middle_name'   => 'Smith',
            'last_name'     => 'Doe',
            'suffix_name'   => 'Jr.',
            'gender_id'     => Gender::inRandomOrder()->first()->gender_id,
            'role_id'       => $adminRole->role_id,
            'department_id' => Department::inRandomOrder()->first()->department_id,
            'birth_date'    => $birthDate,
            'age'           => $age,
            'username'      => 'admin123',
            'password'      => 'admin123',
            'status'        => 'active',
        ]);

        // Random personnel
        Personnel::factory(20)->create();

        // ── Students ──────────────────────────────────────────────────────
        $birthDate = fake()->dateTimeBetween('-22 years', '-17 years')->format('Y-m-d');
        $age       = date_diff(date_create($birthDate), date_create('now'))->y;

        // Guaranteed student account
        Student::create([
            'first_name'    => 'Jane',
            'middle_name'   => 'Marie',
            'last_name'     => 'Santos',
            'suffix_name'   => null,
            'gender_id'     => Gender::where('gender', 'Female')->first()->gender_id,
            'course_id'     => Course::inRandomOrder()->first()->course_id,
            'year_level_id' => YearLevel::inRandomOrder()->first()->year_level_id,
            'department_id' => Department::inRandomOrder()->first()->department_id,
            'birth_date'    => $birthDate,
            'age'           => $age,
            'username'      => 'student1',
            'password'      => 'student1',
            'status'        => 'active',
        ]);

        // Random students
        Student::factory(100)->create();
    }
}
