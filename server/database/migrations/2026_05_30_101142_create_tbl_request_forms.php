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
        Schema::create('tbl_request_forms', function (Blueprint $table) {
            $table->id('request_id');
            $table->string('request_number', 50)->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('laboratory_id');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->enum('request_type', [
                'borrow',
                'maintenance',
                'repair',
                'release'
            ]);
            $table->text('purpose');
            $table->date('request_date');
            $table->date('expected_return_date')->nullable();
            $table->date('actual_return_date')->nullable();
            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'ongoing',
                'completed',
                'cancelled'
            ])->default('pending');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('user_id')
                ->references('user_id')
                ->on('tbl_users')
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

            $table->foreign('approved_by')
                ->references('user_id')
                ->on('tbl_users')
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
        Schema::dropIfExists('tbl_request_forms');
        Schema::enableForeignKeyConstraints();
    }
};
