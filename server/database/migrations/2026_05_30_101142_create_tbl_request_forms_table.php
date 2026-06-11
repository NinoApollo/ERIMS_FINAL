<?php
// database/migrations/2026_05_30_101142_create_tbl_request_forms_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_request_forms', function (Blueprint $table) {
            $table->id('request_id');
            $table->string('request_number', 50)->unique();

            $table->unsignedBigInteger('requestor_id');
            $table->enum('requestor_type', ['student', 'personnel']);

            $table->unsignedBigInteger('laboratory_id');
            $table->unsignedBigInteger('area_id')->nullable();
            $table->unsignedBigInteger('course_id')->nullable();

            $table->unsignedBigInteger('faculty_incharge_id')->nullable();
            $table->unsignedBigInteger('released_by')->nullable();
            $table->unsignedBigInteger('endorsed_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();

            $table->string('subject', 100)->nullable();
            $table->text('purpose');

            $table->enum('request_type', [
                'borrow',
                'maintenance',
                'repair',
                'release',
            ]);

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'ongoing',
                'completed',
                'cancelled',
            ])->default('pending');

            // Add JSON field for requested equipments
            $table->json('requested_equipments')->nullable();

            $table->date('request_date');
            $table->date('date_of_use');
            $table->time('time_of_use');
            $table->date('expected_return_date')->nullable();
            $table->date('actual_return_date')->nullable();

            $table->timestamp('endorsed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('released_at')->nullable();

            $table->text('remarks')->nullable();
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('laboratory_id')
                ->references('laboratory_id')
                ->on('tbl_laboratories')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('area_id')
                ->references('area_id')
                ->on('tbl_areas')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('course_id')
                ->references('course_id')
                ->on('tbl_courses')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('faculty_incharge_id')
                ->references('personnel_id')
                ->on('tbl_personnels')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('released_by')
                ->references('personnel_id')
                ->on('tbl_personnels')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('endorsed_by')
                ->references('personnel_id')
                ->on('tbl_personnels')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('approved_by')
                ->references('personnel_id')
                ->on('tbl_personnels')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_request_forms');
        Schema::enableForeignKeyConstraints();
    }
};
