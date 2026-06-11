<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\LaboratoryController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\Api\RequestFormController;
use App\Http\Controllers\Api\RequestFormItemController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\YearLevelController;
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

    Route::controller(YearLevelController::class)->prefix('/year-level')->group(function() {
        Route::get('/loadYearLevels', 'loadYearLevels');
        Route::get('/getYearLevel/{yearLevelId}', 'getYearLevel');
        Route::post('/storeYearLevel', 'storeYearLevel');
        Route::put('/updateYearLevel/{yearLevel}', 'updateYearLevel');
        Route::put('/destroyYearLevel/{yearLevel}', 'destroyYearLevel');
    });

    Route::controller(GenderController::class)->prefix('/gender')->group(function() {
        Route::get('/loadGenders', 'loadGenders');
        Route::get('/getGender/{genderId}', 'getGender');
        Route::post('/storeGender', 'storeGender');
        Route::put('/updateGender/{gender}', 'updateGender');
        Route::put('/destroyGender/{gender}', 'destroyGender');
    });

    Route::controller(DepartmentController::class)->prefix('/department')->group(function() {
        Route::get('/loadDepartments', 'loadDepartments');
        Route::get('/getDepartment/{departmentId}', 'getDepartment');
        Route::post('/storeDepartment', 'storeDepartment');
        Route::put('/updateDepartment/{department}', 'updateDepartment');
        Route::put('/destroyDepartment/{department}', 'destroyDepartment');
    });

    Route::controller(StudentController::class)->prefix('/student')->group(function() {
        Route::get('/loadStudents', 'loadStudents');
        Route::get('/getStudent/{studentId}', 'getStudent');
        Route::post('/storeStudent', 'storeStudent');
        Route::put('/updateStudent/{student}', 'updateStudent');
        Route::put('/destroyStudent/{student}', 'destroyStudent');
    });

    Route::controller(PersonnelController::class)->prefix('/personnel')->group(function() {
        Route::get('/loadPersonnels', 'loadPersonnels');
        Route::get('/getPersonnel/{personnelId}', 'getPersonnel');
        Route::post('/storePersonnel', 'storePersonnel');
        Route::put('/updatePersonnel/{personnel}', 'updatePersonnel');
        Route::put('/destroyPersonnel/{personnel}', 'destroyPersonnel');
    });

    Route::controller(LaboratoryController::class)->prefix('/laboratory')->group(function() {
        Route::get('/loadLaboratories', 'loadLaboratories');
        Route::get('/getLaboratory/{laboratoryId}', 'getLaboratory');
        Route::post('/storeLaboratory', 'storeLaboratory');
        Route::put('/updateLaboratory/{laboratory}', 'updateLaboratory');
        Route::put('/destroyLaboratory/{laboratory}', 'destroyLaboratory');
    });

    Route::controller(AreaController::class)->prefix('/area')->group(function() {
        Route::get('/loadAreas', 'loadAreas');
        Route::get('/getArea/{areaId}', 'getArea');
        Route::post('/storeArea', 'storeArea');
        Route::put('/updateArea/{area}', 'updateArea');
        Route::put('/destroyArea/{area}', 'destroyArea');
    });

    Route::controller(EquipmentController::class)->prefix('/equipment')->group(function() {
        Route::get('/loadEquipments', 'loadEquipments');
        Route::get('/getEquipment/{equipmentId}', 'getEquipment');
        Route::post('/storeEquipment', 'storeEquipment');
        Route::put('/updateEquipment/{equipment}', 'updateEquipment');
        Route::put('/destroyEquipment/{equipment}', 'destroyEquipment');
    });

    Route::controller(RequestFormController::class)->prefix('/request-form')->group(function() {
        Route::get('/loadRequestForms', 'loadRequestForms');
        Route::get('/getRequestForm/{requestId}', 'getRequestForm');
        Route::post('/storeRequestForm', 'storeRequestForm');
        Route::put('/updateRequestForm/{requestForm}', 'updateRequestForm');
        Route::put('/updateRequestFormStatus/{requestForm}', 'updateRequestFormStatus');
        Route::put('/destroyRequestForm/{requestForm}', 'destroyRequestForm');
    });

    Route::controller(ActivityLogController::class)->prefix('/activity-log')->group(function() {
        Route::get('/loadActivityLogs', 'loadActivityLogs');
        Route::get('/getActivityLog/{logId}', 'getActivityLog');
        Route::get('/getActivityStats', 'getActivityStats');
        Route::delete('/clearOldLogs', 'clearOldLogs');
    });
});
