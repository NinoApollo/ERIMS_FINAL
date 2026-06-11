<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Gender;
use App\Models\Personnel;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Personnel>
 */
class PersonnelFactory extends Factory
{
    protected $model = Personnel::class;

    public function definition(): array
    {
        $birthDate = fake()->date();
        $age       = date_diff(date_create($birthDate), date_create('now'))->y;

        return [
            'profile_picture' => null,
            'first_name'      => fake()->firstName(),
            'middle_name'     => fake()->optional(0.7)->lastName(),
            'last_name'       => fake()->lastName(),
            'suffix_name'     => fake()->optional(0.1)->suffix(),
            'gender_id'       => Gender::inRandomOrder()->first()->gender_id,
            'role_id'         => Role::inRandomOrder()->first()->role_id,
            'department_id'   => Department::inRandomOrder()->first()->department_id,
            'birth_date'      => $birthDate,
            'age'             => $age,
            'username'        => fake()->unique()->regexify('[a-z]{4}[0-9]{4}'),
            'password'        => 'password',
            'status'          => 'active',
            'is_deleted'      => false,
        ];
    }
}
