<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        // Vrati sve korisnike osim admina samog
        return User::where('role', '!=', 'admin')->get();
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Ne možeš obrisati admina'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Korisnik obrisan uspešno']);
    }
}
