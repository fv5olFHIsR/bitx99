<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App;

class ChatController extends Controller
{
    //
    public function getMessages($conversationId=1){
        $chat = App::make('Chat');
        $user = Auth::user();
        $conversation = $chat::conversations()->getById($conversationId);
        $messages = $chat::conversation($conversation)->for($user)->getMessages();
        $msg = [];
        foreach($messages as $message){
            $msg[] = $chat::messages()->getById($message->id);               
        }
        return $msg;

        // Get the currently authenticated user's ID...
        $id = Auth::id();

        $userId=1;
        $userId2=2;
        $participants = [$userId, $userId2];

        
        //$conversation = $chat::createConversation($participants);
        $data = ['title' => 'PHP Channel', 'description' => 'PHP Channel Description'];
        //$conversation->update(['data' => $data]);       
        //dump($conversation);

        //$users = $conversation->users;
        $messages = $chat::conversation($conversation)->for($user)->getMessages();
        $msg = [];

        //$messages = $this->getConversations();
        
        //dump($messages);
        foreach($messages as $message){
            $msg[] = $chat::messages()->getById($message->id);               
        }
        //$conversations = $chat::conversations()->common([$id]);
        //dump($conversations);
        //dump($msg);
        //$user_conversations = $chat::conversations()->for($user);
        //dump($user_conversations);
        //dump($msg);
        //return $msg;
    }
    public function getConversations(){
        $chat = App::make('Chat');
        $user = Auth::user();
        $conversations = $chat::conversations()
        ->for($user)
        ->limit(100)
        ->page(1)
        ->get();
        return $conversations;
    }
    public function sendMessage(Request $request){
        $chat = App::make('Chat');
        $messageBody = $request->input('message');
        $conversationId = $request->input('conversation');
        $conversation = $chat::conversations()->getById($conversationId);
        $user = Auth::user();
        $message = $chat::message($messageBody)
        ->from($user)
        ->to($conversation)
        ->send();
    }
}
