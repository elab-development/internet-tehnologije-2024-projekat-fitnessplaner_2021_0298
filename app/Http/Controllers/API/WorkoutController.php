<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workout;
use Illuminate\Support\Facades\Auth;

class WorkoutController extends Controller
{
    public function index()
    {
        return Workout::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'duration' => 'required|integer',
            'workout_date' => 'required|date',
            'day' => 'required|string|max:20',
            'coach_id' => 'nullable|integer',
        ]);
        $validated['user_id'] = Auth::id();
        return Workout::create($validated);
    }

    public function show($id)
    {
        return Workout::where('user_id', Auth::id())->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $workout = Workout::where('user_id', Auth::id())->findOrFail($id);
        $workout->update($request->only(['title', 'duration']));
        return $workout;
    }

    public function destroy($id)
    {
        $workout = Workout::where('user_id', Auth::id())->findOrFail($id);
        $workout->delete();
        return response()->json(['message' => 'Deleted']);
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

    return response()->json($workouts);
}
}
