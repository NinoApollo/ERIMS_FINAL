<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\LaboratoryController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->prefix('/auth')->group(function() {
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(function() {
    Route::controller(AuthController::class)->prefix('/auth')->group(function() {
        Route::get('/me', 'me');
        Route::post('/logout', 'logout');
    });

    Route::controller(RoleController::class)->prefix('/role')->group(function() {
        Route::get('/loadRoles', 'loadRoles');
        Route::get('/getRole/{roleId}', 'getRole');
        Route::post('/storeRole', 'storeRole');
        Route::put('/updateRole/{role}', 'updateRole');
        Route::put('/destroyRole/{role}', 'destroyRole');
    });

    Route::controller(CourseController::class)->prefix('/course')->group(function() {
        Route::get('/loadCourses', 'loadCourses');
        Route::get('/getCourse/{courseId}', 'getCourse');
        Route::post('/storeCourse', 'storeCourse');
        Route::put('/updateCourse/{course}', 'updateCourse');
        Route::put('/destroyCourse/{course}', 'destroyCourse');
    });

    Route::controller(CategoryController::class)->prefix('/category')->group(function() {
        Route::get('/loadCategories', 'loadCategories');
        Route::get('/getCategory/{categoryId}', 'getCategory');
        Route::post('/storeCategory', 'storeCategory');
        Route::put('/updateCategory/{category}', 'updateCategory');
        Route::put('/destroyCategory/{category}', 'destroyCategory');
    });

    Route::controller(UserController::class)->prefix('/user')->group(function() {
        Route::get('/loadUsers', 'loadUsers');
        Route::post('/storeUser', 'storeUser');
        Route::put('/updateUser/{user}', 'updateUser');
        Route::put('/destroyUser/{user}', 'destroyUser');
    });

    Route::controller(LaboratoryController::class)->prefix('/laboratory')->group(function() {
        Route::get('/loadLaboratories', 'loadLaboratories');
        Route::get('/getLaboratory/{laboratoryId}', 'getLaboratory');
        Route::post('/storeLaboratory', 'storeLaboratory');
        Route::put('/updateLaboratory/{laboratory}', 'updateLaboratory');
        Route::put('/destroyLaboratory/{laboratory}', 'destroyLaboratory');
    });
});
