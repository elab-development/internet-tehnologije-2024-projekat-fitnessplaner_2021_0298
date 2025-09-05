<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class CoachController extends Controller
{
    public function getUsers(Request $request)
    {
        $coachId = $request->user()->id;

        $users = User::whereHas('workouts', function ($query) use ($coachId) {
                $query->where('coach_id', $coachId);
            })
            ->with(['workouts' => function ($query) use ($coachId) {
                $query->where('coach_id', $coachId);
            }])
            ->get();

        return response()->json(
            $users->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'trainings' => $user->workouts->map(function($workout) {
                        return [
                            'id' => $workout->id,
                            'title' => $workout->title,
                            'description' => $workout->description ?? '',
                            'day' => $workout->day,
                            'exercises' => $workout->exercises,
                            'workout_date' => $workout->workout_date,
                        ];
                    }),
                ];
            })
        );
    }

    public function addWorkout(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'title' => 'required|string|max:255',
        'day' => 'nullable|string|max:255',
        'workout_date' => 'required|date',
        'duration' => 'nullable|integer',
        'exercises' => 'nullable|array', // <-- promenjeno sa json na array
        'exercises.*' => 'string|max:255', // svaki element niza je string
    ]);

    $workout = \App\Models\Workout::create([
        'user_id' => $request->user_id,
        'title' => $request->title,
        'day' => $request->day,
        'workout_date' => $request->workout_date,
        'duration' => $request->duration,
        'coach_id' => $request->user()->id,
        'exercises' => $request->exercises, // šalješ običan niz iz React-a
    ]);

    return response()->json([
        'message' => 'Workout created successfully',
        'workout' => $workout
    ]);
}

}
