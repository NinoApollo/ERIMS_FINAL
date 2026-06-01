<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('profile_picture', 255)->nullable();
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->unsignedBigInteger('role_id');
            $table->date('birth_date');
            $table->integer('age');
            $table->string('username', 55);
            $table->string('password', 255);
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('role_id')
                ->references('role_id')
                ->on('tbl_roles')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->enum('status', [
                'active',
                'inactive'
            ])->default('active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_users');
        Schema::enableForeignKeyConstraints();
    }
};
