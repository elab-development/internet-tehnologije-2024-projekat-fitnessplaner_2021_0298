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
                            'workout_date' => $workout->workout_date,
                        ];
                    }),
                ];
            })
        );
    }
}
