<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NutritionEntryResource;

class NutritionEntryController extends Controller
{
    public function index()
    {
        //return NutritionEntry::where('user_id', Auth::id())->get();
        $entries = NutritionEntry::where('user_id', Auth::id())->get();
        return NutritionEntryResource::collection($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
             'meal_type' => 'required|string|max:255',
        'calories' => 'required|integer',
        'entry_date' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();

        //return NutritionEntry::create($validated);
        $entry = NutritionEntry::create($validated);
        return new NutritionEntryResource($entry);
    }

    public function show($id)
    {
        //return NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
        $entry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
        return new NutritionEntryResource($entry);
    }

    public function update(Request $request, $id)
    {
        //$nutritionEntry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);

        //$nutritionEntry->update($request->only(['meal_type', 'calories', 'entry_date']));

        //return $nutritionEntry;
        $entry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'meal_type' => 'sometimes|string|max:255',
            'calories' => 'sometimes|integer',
            'entry_date' => 'sometimes|date',
        ]);

        $entry->update($validated);

        return new NutritionEntryResource($entry);
    }

    public function destroy($id)
    {
        //$nutritionEntry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
        //$nutritionEntry->delete();

        //return response()->json(['message' => 'Deleted']);
        $entry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

