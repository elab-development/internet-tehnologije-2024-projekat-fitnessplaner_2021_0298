<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\WorkoutController;
use App\Http\Controllers\API\NutritionEntryController;
use App\Http\Controllers\API\HydrationEntryController;
use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('workouts', WorkoutController::class);
    Route::apiResource('nutrition-entries', NutritionEntryController::class);
    Route::apiResource('hydration-entries', HydrationEntryController::class);
});
