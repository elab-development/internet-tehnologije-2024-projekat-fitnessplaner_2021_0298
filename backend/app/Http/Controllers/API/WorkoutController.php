<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\WorkoutResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workout;
use Illuminate\Support\Facades\Auth;

class WorkoutController extends Controller
{
    public function index()
    {
        //return Workout::where('user_id', Auth::id())->get();
        $workouts = Workout::where('user_id', Auth::id())->paginate(5);
        return WorkoutResource::collection($workouts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'duration' => 'required|integer',
            'workout_date' => 'required|date',
            'day' => 'required|string|max:20',
            'coach_id' => 'nullable|integer',
            'exercises' => 'nullable|array'
        ]);
        $validated['user_id'] = Auth::id();
        //return Workout::create($validated);
        $workout = Workout::create($validated);
        //return new WorkoutResource($workout);
        return response()->json([
    'msg' => 'Trening je uspešno kreiran!'
], 201);

    }

    public function show($id)
    {
        //return Workout::where('user_id', Auth::id())->findOrFail($id);
        $workout = Workout::where('user_id', Auth::id())->findOrFail($id);
        return new WorkoutResource($workout);
    }

    public function update(Request $request, $id)
{
    $user = $request->user();

    $workout = Workout::findOrFail($id);

    // Provera prava: korisnik ili trener koji je vezan za trening
    if ($workout->user_id !== $user->id && $workout->coach_id !== $user->id) {
        return response()->json(['message' => 'Nije dozvoljeno'], 403);
    }

    $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'duration' => 'sometimes|integer',
        'workout_date' => 'sometimes|date',
        'day' => 'sometimes|string|max:20',
        'coach_id' => 'nullable|integer',
        'exercises' => 'nullable|array',
    ]);

    $workout->update($validated);

    return new WorkoutResource($workout);
}


    public function destroy($id)
{
    $workout = Workout::findOrFail($id);

    $currentUser = Auth::user();

    // Provera: korisnik može da briše svoj trening, trener može da briše treninge svojih korisnika
    if ($currentUser->role === 'user' && $workout->user_id !== $currentUser->id) {
        return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj trening'], 403);
    }

    if ($currentUser->role === 'coach' && $workout->coach_id !== $currentUser->id) {
        return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj trening'], 403);
    }

    $workout->delete();

    return response()->json(['message' => 'Trening uspešno obrisan']);
}
    public function getByDay($day)
{
    // Validacija dana u nedelji (opcionalno)
    $validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!in_array($day, $validDays)) {
        return response()->json(['error' => 'Invalid day'], 400);
    }

    // Vraćanje vežbi za korisnika i konkretan dan
    $workouts = Workout::where('user_id', Auth::id())
        ->where('day', $day)
        ->get();

    //return response()->json($workouts);
    return WorkoutResource::collection($workouts);
}
}
