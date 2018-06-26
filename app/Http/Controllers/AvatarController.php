<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App;

class AvatarController extends Controller
{
    //
    public function create($string){
        $avatar = App::make('Avatar');
        $avimg=$avatar::create($string)->toBase64();

        return('<img src="'.$avimg->encoded.'" />');
        //return $avatar;
    } 
}
