<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HydrationEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HydrationEntryController extends Controller
{
    public function index()
    {
        return HydrationEntry::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount_ml' => 'required|integer',
            'time' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();

        return HydrationEntry::create($validated);
    }

    public function show($id)
    {
        return HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $hydrationEntry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);

        $hydrationEntry->update($request->only(['amount_ml', 'time']));

        return $hydrationEntry;
    }

    public function destroy($id)
    {
        $hydrationEntry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
        $hydrationEntry->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

