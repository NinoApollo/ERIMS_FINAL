<?php

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
