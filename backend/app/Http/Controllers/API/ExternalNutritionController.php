<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ExternalNutritionController extends Controller
{
    private array $srToEn = [
        'jabuka' => 'apple',
        'banana' => 'banana',
        'hleb' => 'bread',
        'mleko' => 'milk',
        'jaje' => 'egg',
        'piletina' => 'chicken',
        'govedina' => 'beef',
        'teletina' => 'veal',
        'sir' => 'cheese',
        'yogurt' => 'yogurt',
        'pirinač' => 'rice',
        'pasta' => 'pasta',
    ];

    public function lookup(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '') {
            return response()->json(['error' => 'Parameter q is required'], 422);
        }

        $normalized = mb_strtolower($q);
        $ingr = $this->srToEn[$normalized] ?? $q;

        $cacheKey = 'edamam_lookup:' . md5($ingr);

        $json = Cache::remember($cacheKey, now()->addHours(12), function () use ($ingr) {
            $url = 'https://api.edamam.com/api/food-database/v2/parser';
            $res = Http::timeout(10)->get($url, [
                'app_id' => config('services.edamam.id'),
                'app_key' => config('services.edamam.key'),
                'ingr' => $ingr,
                'nutrition-type' => 'cooking',
            ]);

            if (!$res->ok()) {
                abort(502, 'External API error');
            }

            return $res->json();
        });

        $hint = $json['hints'][0] ?? null;
        if (!$hint) {
            return response()->json([
                'found' => false,
                'query' => $q,
                'normalized_query' => $ingr,
            ]);
        }

        $food = $hint['food'] ?? [];
        $nutr = $food['nutrients'] ?? [];

        return response()->json([
            'found' => true,
            'query' => $q,
            'normalized_query' => $ingr,
            'label' => $food['label'] ?? null,
            'category' => $food['category'] ?? null,
            'per' => '100g',
            'calories_kcal' => $nutr['ENERC_KCAL'] ?? null,
            'protein_g' => $nutr['PROCNT'] ?? null,
            'fat_g' => $nutr['FAT'] ?? null,
            'carbs_g' => $nutr['CHOCDF'] ?? null,
            'fiber_g' => $nutr['FIBTG'] ?? null,
        ]);
    }
}
