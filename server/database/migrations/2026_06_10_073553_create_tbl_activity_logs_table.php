<?php
// database/migrations/2026_06_10_073553_create_tbl_activity_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_activity_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('personnel_id')->nullable();
            $table->unsignedBigInteger('request_id')->nullable();
            $table->string('action', 100);
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('student_id')
                ->references('student_id')
                ->on('tbl_students')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('personnel_id')
                ->references('personnel_id')
                ->on('tbl_personnels')
                ->onUpdate('cascade')
                ->onDelete('set null');

            $table->foreign('request_id')
                ->references('request_id')
                ->on('tbl_request_forms')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_activity_logs');
        Schema::enableForeignKeyConstraints();
    }
};
