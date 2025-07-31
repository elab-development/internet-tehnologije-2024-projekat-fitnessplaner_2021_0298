<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HydrationEntry extends Model
{
    protected $fillable = ['amount_ml', 'entry_date', 'user_id'];

    public function user()
{
    return $this->belongsTo(User::class);
}

}
