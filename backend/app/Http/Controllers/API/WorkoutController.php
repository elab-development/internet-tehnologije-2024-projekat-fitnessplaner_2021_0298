<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\WorkoutResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Workout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WorkoutController extends Controller
{
    public function index()
    {
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
            'exercises' => 'nullable|array',
        ]);

        $validated['user_id'] = Auth::id();

        DB::beginTransaction();
        try {
            $workout = Workout::create($validated);

            // Ako u budućnosti budeš imao posebnu tabelu vežbi:
            // foreach ($validated['exercises'] ?? [] as $exercise) {
            //     Exercise::create([
            //         'workout_id' => $workout->id,
            //         'name' => $exercise
            //     ]);
            // }

            DB::commit();

            return response()->json([
                'msg' => 'Trening je uspešno kreiran!',
                'workout' => $workout
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Došlo je do greške: '.$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $workout = Workout::where('user_id', Auth::id())->findOrFail($id);
        return new WorkoutResource($workout);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $workout = Workout::findOrFail($id);

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

        DB::beginTransaction();
        try {
            $workout->update($validated);

            // Ako bude posebna tabela vežbi:
            // Exercise::where('workout_id', $workout->id)->delete();
            // foreach ($validated['exercises'] ?? [] as $exercise) {
            //     Exercise::create([
            //         'workout_id' => $workout->id,
            //         'name' => $exercise
            //     ]);
            // }

            DB::commit();
            return new WorkoutResource($workout);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Došlo je do greške: '.$e->getMessage()], 500);
        }
    }

    public function storeForUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'workout_date' => 'required|date',
            'day' => 'required|string',
            'duration' => 'nullable|integer',
            'exercises' => 'nullable|array',
            'exercises.*' => 'string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $workout = Workout::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'workout_date' => $request->workout_date,
                'day' => $request->day,
                'duration' => $request->duration,
                'exercises' => $request->exercises,
                'coach_id' => auth()->id(),
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Workout successfully created for user',
                'workout' => $workout,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Došlo je do greške: '.$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $workout = Workout::findOrFail($id);
        $currentUser = Auth::user();

        if ($currentUser->role === 'user' && $workout->user_id !== $currentUser->id) {
            return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj trening'], 403);
        }

        if ($currentUser->role === 'coach' && $workout->coach_id !== $currentUser->id) {
            return response()->json(['message' => 'Nemate dozvolu da obrišete ovaj trening'], 403);
        }

        DB::beginTransaction();
        try {
            $workout->delete();
            // Ako bude posebna tabela vežbi:
            // Exercise::where('workout_id', $workout->id)->delete();

            DB::commit();
            return response()->json(['message' => 'Trening uspešno obrisan']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Došlo je do greške: '.$e->getMessage()], 500);
        }
    }

    public function getByUser($userId)
{
    $workouts = \App\Models\Workout::where('user_id', $userId)->get();
    return response()->json($workouts);
}


    public function getByDay($day)
    {
        $validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!in_array($day, $validDays)) {
            return response()->json(['error' => 'Invalid day'], 400);
        }

        $workouts = Workout::where('user_id', Auth::id())
            ->where('day', $day)
            ->get();

        return WorkoutResource::collection($workouts);
    }
}
