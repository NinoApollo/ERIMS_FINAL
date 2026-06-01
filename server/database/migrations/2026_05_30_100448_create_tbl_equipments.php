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
        Schema::create('tbl_equipments', function (Blueprint $table) {
            $table->id('equipment_id');
            $table->string('equipment', 255);
            $table->string('serial_number', 100)->nullable();
            $table->string('model_number', 100)->nullable();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('laboratory_id');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->enum('status', [
                'available',
                'in_use',
                'under_maintenance',
                'damaged',
                'decommissioned'
            ])->default('available');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('category_id')
                ->references('category_id')
                ->on('tbl_categories')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('laboratory_id')
                ->references('laboratory_id')
                ->on('tbl_laboratories')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('course_id')
                ->references('course_id')
                ->on('tbl_courses')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_equipments');
        Schema::enableForeignKeyConstraints();
    }
};
