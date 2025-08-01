<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HydrationEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\HydrationEntryResource;

class HydrationEntryController extends Controller
{
    public function index()
    {
        //return HydrationEntry::where('user_id', Auth::id())->get();
        $entries = HydrationEntry::where('user_id', Auth::id())->paginate(5);
        return HydrationEntryResource::collection($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount_ml' => 'required|integer',
            'entry_date' => 'required|date',
        ]);

        $validated['user_id'] = Auth::id();
        //$entry = HydrationEntry::create($validated);
        //return response()->json($entry, 201);
        

        //return HydrationEntry::create($validated);
        $entry = HydrationEntry::create($validated);
        //return new HydrationEntryResource($entry);
        return response()->json([
    'msg' => 'Unos vode uspešno kreiran!'
], 201);

    }

    public function show($id)
    {
        //return HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
        $entry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
        return new HydrationEntryResource($entry);
    }

    public function update(Request $request, $id)
    {
        //$hydrationEntry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);

        //$hydrationEntry->update($request->only(['amount_ml', 'entry_date']));

        //return $hydrationEntry;
        $entry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'amount_ml' => 'sometimes|integer',
            'entry_date' => 'sometimes|date',
        ]);

        $entry->update($validated);

        return new HydrationEntryResource($entry);
    }

    public function destroy($id)
    {
        //$hydrationEntry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
        //$hydrationEntry->delete();

        //return response()->json(['message' => 'Deleted']);
        $entry = HydrationEntry::where('user_id', Auth::id())->findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function getAmountByDate(Request $request)
{
    $validated = $request->validate([
        'entry_date' => 'required|date',
    ]);

    $totalAmount = HydrationEntry::where('user_id', auth()->id())
        ->where('entry_date', $validated['entry_date'])
        ->sum('amount_ml');

    return response()->json([
        'entry_date' => $validated['entry_date'],
        'total_amount' => $totalAmount,
    ]);
}
}

