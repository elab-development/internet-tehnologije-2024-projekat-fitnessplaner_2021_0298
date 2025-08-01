<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HydrationEntry extends Model
{
    use HasFactory;
    
    protected $fillable = ['amount_ml', 'entry_date', 'user_id'];

    public function user()
{
    return $this->belongsTo(User::class);
}

}
