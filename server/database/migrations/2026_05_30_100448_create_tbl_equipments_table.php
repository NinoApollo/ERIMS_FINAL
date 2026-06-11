<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_equipments', function (Blueprint $table) {
            $table->id('equipment_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('area_id');
            $table->string('equipment_code', 20)->unique();
            $table->string('image', 255)->nullable();
            $table->string('equipment_name', 255);
            $table->string('brand', 100)->nullable();
            $table->string('model', 100)->nullable();
            $table->string('serial_number', 100)->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->unsignedSmallInteger('available_quantity')->default(1);
            $table->enum('unit', ['pcs', 'set', 'unit'])->default('pcs');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 10, 2)->nullable();
            $table->enum('condition', [
                'new',
                'good',
                'fair',
                'damaged',
            ])->default('new');
            $table->enum('status', [
                'available',
                'in_use',
                'borrowed',
                'maintenance',
                'lost',
                'returned',
            ])->default('available');
            $table->text('remarks')->nullable();
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('category_id')
                ->references('category_id')
                ->on('tbl_categories')
                ->onUpdate('cascade')
                ->onDelete('restrict');

            $table->foreign('area_id')
                ->references('area_id')
                ->on('tbl_areas')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_equipments');
        Schema::enableForeignKeyConstraints();
    }
};
