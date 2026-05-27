<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
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
        Route::get('/loadRoles', 'loadRoles'); // /role/loadRoles
        Route::get('/getRole/{roleId}', 'getRole');
        Route::post('/storeRole', 'storeRole'); // /role/storeRole
        Route::put('/updateRole/{role}', 'updateRole');
        Route::put('/destroyRole/{role}', 'destroyRole');
    });

    Route::controller(UserController::class)->prefix('/user')->group(function() {
        Route::get('loadUsers', 'loadUsers');
        Route::post('/storeUser', 'storeUser');
        Route::put('/updateUser/{user}', 'updateUser');
        Route::put('destroyUser/{user}', 'destroyUser');
    });
});


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
