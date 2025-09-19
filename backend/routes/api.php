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

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

use Barryvdh\DomPDF\Facade\Pdf;

use App\Http\Controllers\API\AdminController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->put('/workouts/{id}', [WorkoutController::class, 'update']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/coach/add-workout', [WorkoutController::class, 'storeForUser']);
});


Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

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

   // Standardna paginacija
Route::get('/workouts', [WorkoutController::class, 'index']);

// Sve za kalendar (bez paginacije)
Route::get('/workouts/all', [WorkoutController::class, 'all']);

// Lista po danu
Route::get('/workouts/by-day/{day}', [WorkoutController::class, 'getByDay']);

// Kreiranje novog treninga
Route::post('/workouts', [WorkoutController::class, 'store']);

// Brisanje treninga
Route::delete('/workouts/{id}', [WorkoutController::class, 'destroy']);

// Ažuriranje treninga
Route::put('/workouts/{id}', [WorkoutController::class, 'update']);

    

    Route::get('/nutrition-entries/total-calories', function () {
    $total = \App\Models\NutritionEntry::where('user_id', auth()->id())->sum('calories');
    return response()->json(['total_calories' => $total]);
});

Route::get('/hydration-entries/total-ml', function () {
    $total = \App\Models\HydrationEntry::where('user_id', auth()->id())->sum('amount_ml');
    return response()->json(['total_water_ml' => $total]);
});

// filtriranje po danima
Route::get('/workouts/by-day/{day}', [WorkoutController::class, 'getByDay']);

//Route::get('/nutrition-hydration-summary', function () {
   // $userId = auth()->id();

   // return response()->json([
  //      'nutrition' => \App\Models\NutritionEntry::where('user_id', $userId)->select('meal_type', 'calories')->get(),
   //     'hydration' => \App\Models\HydrationEntry::where('user_id', $userId)->select('amount_ml')->get(),
  //  ]);
//});

Route::middleware('auth:sanctum')->get('/nutrition-hydration-summary', function (Request $request) {
    $userId = auth()->id();

    $date = $request->query('date') 
        ? Carbon::parse($request->query('date'))->toDateString()
        : Carbon::today()->toDateString();

    // Nutrition unosi
    $nutrition = \DB::table('nutrition_entries')
        ->where('user_id', $userId)
        ->whereDate('created_at', $date)
        ->select('meal_type', 'calories')
        ->get();

    // Hydration unosi
    $hydration = \DB::table('hydration_entries')
        ->where('user_id', $userId)
        ->whereDate('created_at', $date)
        ->select('amount_ml')
        ->get();

    // JOIN primer: povezivanje nutrition i hydration po user_id
    $joined = \DB::table('nutrition_entries')
        ->leftJoin('hydration_entries', function($join) use ($userId, $date) {
            $join->on('nutrition_entries.user_id', '=', 'hydration_entries.user_id')
                 ->whereDate('hydration_entries.created_at', $date);
        })
        ->where('nutrition_entries.user_id', $userId)
        ->whereDate('nutrition_entries.created_at', $date)
        ->select(
            'nutrition_entries.meal_type',
            'nutrition_entries.calories',
            'hydration_entries.amount_ml'
        )
        ->get();

    return response()->json([
        'date' => $date,
        'nutrition' => $nutrition,
        'hydration' => $hydration,
        'joined_entries' => $joined,
    ]);
});








Route::get('/nutrition-entries/total-by-date', [NutritionEntryController::class, 'getCaloriesByDate']);

Route::get('/hydration-entries/total-by-date', [HydrationEntryController::class, 'getAmountByDate']);

Route::apiResource('workouts', WorkoutController::class);
    Route::apiResource('nutrition-entries', NutritionEntryController::class);
    Route::apiResource('hydration-entries', HydrationEntryController::class);

});

Route::get('/nutrition-daily-calories', [NutritionEntryController::class, 'getDailyCalories'])->middleware('auth:sanctum');


// ugnjezdene rute
Route::get('/users/{user}/nutrition-entries', [NutritionEntryController::class, 'getByUser']);
Route::get('/users/{user}/workouts', [WorkoutController::class, 'getByUser']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
});



Route::middleware('auth:sanctum')->get('/nutrition-hydration-summary/pdf', function (Request $request) {
    $userId = auth()->id();

    $date = $request->query('date') 
        ? Carbon::parse($request->query('date'))->toDateString()
        : Carbon::today()->toDateString();

    $nutrition = \App\Models\NutritionEntry::where('user_id', $userId)
                    ->whereDate('created_at', $date)
                    ->select('meal_type', 'calories')
                    ->get();

    $hydration = \App\Models\HydrationEntry::where('user_id', $userId)
                    ->whereDate('created_at', $date)
                    ->select('amount_ml')
                    ->get();

    $pdf = Pdf::loadView('pdf.daily-summary', [
        'date' => $date,
        'nutrition' => $nutrition,
        'hydration' => $hydration,
    ]);

    return $pdf->download("daily-summary-{$date}.pdf");
});
