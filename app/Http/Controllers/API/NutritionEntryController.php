<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\NutritionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NutritionEntryController extends Controller
{
    public function index()
    {
        return NutritionEntry::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
             'meal_type' => 'required|string|max:255',
        'calories' => 'required|integer',
        'entry_date' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();

        return NutritionEntry::create($validated);
    }

    public function show($id)
    {
        return NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $nutritionEntry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);

        $nutritionEntry->update($request->only(['meal_type', 'calories', 'entry_date']));

        return $nutritionEntry;
    }

    public function destroy($id)
    {
        $nutritionEntry = NutritionEntry::where('user_id', Auth::id())->findOrFail($id);
        $nutritionEntry->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

