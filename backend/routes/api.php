<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\WorkoutController;
use App\Http\Controllers\API\NutritionEntryController;
use App\Http\Controllers\API\HydrationEntryController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ExternalNutritionController;
use App\Http\Controllers\API\CoachController;

use Illuminate\Support\Carbon;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->put('/workouts/{id}', [WorkoutController::class, 'update']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/coach/add-workout', [WorkoutController::class, 'storeForUser']);
});



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/test-auth', function () {
    return response()->json(['user_id' => auth()->id()]);
});


Route::get('/external/nutrition', [ExternalNutritionController::class, 'lookup']);

Route::middleware('auth:sanctum')->get('/coach/users', [CoachController::class, 'getUsers']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

   
    

    Route::get('/nutrition-entries/total-calories', function () {
    $total = \App\Models\NutritionEntry::where('user_id', auth()->id())->sum('calories');
    return response()->json(['total_calories' => $total]);
});

Route::get('/hydration-entries/total-ml', function () {
    $total = \App\Models\HydrationEntry::where('user_id', auth()->id())->sum('amount_ml');
    return response()->json(['total_water_ml' => $total]);
});

Route::get('/workouts/by-day/{day}', [WorkoutController::class, 'getByDay']);

//Route::get('/nutrition-hydration-summary', function () {
   // $userId = auth()->id();

   // return response()->json([
  //      'nutrition' => \App\Models\NutritionEntry::where('user_id', $userId)->select('meal_type', 'calories')->get(),
   //     'hydration' => \App\Models\HydrationEntry::where('user_id', $userId)->select('amount_ml')->get(),
  //  ]);
//});

Route::get('/nutrition-hydration-summary', function (Request $request) {
    $userId = auth()->id();

    $date = $request->query('date') 
        ? Carbon::parse($request->query('date'))->toDateString()
        : Carbon::today()->toDateString();

    return response()->json([
        'date' => $date,
        'nutrition' => \App\Models\NutritionEntry::where('user_id', $userId)
                        ->whereDate('created_at', $date)
                        ->select('meal_type', 'calories')
                        ->get(),
        'hydration' => \App\Models\HydrationEntry::where('user_id', $userId)
                        ->whereDate('created_at', $date)
                        ->select('amount_ml')
                        ->get(),
    ]);
});

Route::get('/nutrition-entries/total-by-date', [NutritionEntryController::class, 'getCaloriesByDate']);

Route::get('/hydration-entries/total-by-date', [HydrationEntryController::class, 'getAmountByDate']);

Route::apiResource('workouts', WorkoutController::class);
    Route::apiResource('nutrition-entries', NutritionEntryController::class);
    Route::apiResource('hydration-entries', HydrationEntryController::class);

});
