<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/play', 'BitxClient@index');
Route::get('/chat/messages', 'ChatController@getMessages');
Route::get('/chat/messages/{convo_id}', 'ChatController@getMessages');
Route::post('/chat/conversation/clear/{convo_id}', 'ChatController@clearConversation');
Route::post('/chat/conversation/create/{user_id}', 'ChatController@createConversation');
Route::post('/chat/messages/send', 'ChatController@sendMessage');
Route::get('/user/avatar/{string}', 'AvatarController@create');
Route::get('/chat/conversations', 'ChatController@getConversations');