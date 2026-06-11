<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_personnels', function (Blueprint $table) {
            $table->id('personnel_id');
            $table->string('profile_picture', 255)->nullable();
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->unsignedBigInteger('gender_id');
            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('department_id');
            $table->date('birth_date');
            $table->integer('age');
            $table->string('username', 55)->unique();
            $table->string('password', 255);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('gender_id')
                ->references('gender_id')
                ->on('tbl_genders')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('role_id')
                ->references('role_id')
                ->on('tbl_roles')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('department_id')
                ->references('department_id')
                ->on('tbl_departments')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_personnels');
        Schema::enableForeignKeyConstraints();
    }
};
