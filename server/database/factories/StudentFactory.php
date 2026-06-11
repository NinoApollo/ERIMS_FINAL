<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Department;
use App\Models\Gender;
use App\Models\Student;
use App\Models\YearLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        $birthDate = fake()->dateTimeBetween('-25 years', '-16 years')->format('Y-m-d');
        $age       = date_diff(date_create($birthDate), date_create('now'))->y;

        return [
            'profile_picture' => null,
            'first_name'      => fake()->firstName(),
            'middle_name'     => fake()->optional(0.7)->lastName(),
            'last_name'       => fake()->lastName(),
            'suffix_name'     => fake()->optional(0.05)->suffix(),
            'gender_id'       => Gender::inRandomOrder()->first()->gender_id,
            'course_id'       => Course::inRandomOrder()->first()->course_id,
            'year_level_id'   => YearLevel::inRandomOrder()->first()->year_level_id,
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
