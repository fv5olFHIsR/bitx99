<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App;
use App\Events\ConversationCreated;
use App\Events\MessageSent;
use App\User;

class ChatController extends Controller
{
    //
    public function getMessages($conversationId=1){

        $chat = App::make('Chat');
        $user = Auth::user();
        $conversation = $chat::conversations()->getById($conversationId);

        //Add new users to common thread if not already added
        $cusr=$conversation->users;
        if($conversationId==1){
            if(!$cusr->contains($user)){
                $chat::conversation($conversation)->addParticipants($user);
                $botuser = User::findOrFail(6);
                $this->doSend($chat, " Welcomer user ".$user->name, $conversation, $botuser);
            }
            
        }
        $messages = $chat::conversation($conversation)->for($user)->limit(10)->sorting("desc")->page(1)->getMessages();
        
        $msg = [];
        foreach($messages as $message){
            $msg[] = $chat::messages()->getById($message->id);
            $chat::message($message)->for($user)->markRead();              
        }

        return $msg;

    }
    public function getConversations(){
        $chat = App::make('Chat');
        $user = Auth::user();
        $conversations = $chat::conversations()
        ->for($user)
        ->limit(100)
        ->page(1)
        ->get();
        $unreadArr=[];
        foreach($conversations as $conv){
            $users = $conv->users;
            $unreadArr[$conv->id] = $chat::conversation($conv)->for($user)->unreadCount();
        }

        return [$conversations,$unreadArr];

    }
    public function createConversation($userId){
            $chat = App::make('Chat');
            $user1 = Auth::user();
            $user2 = User::findOrFail($userId);
            $participants = [$user1, $user2];
            $conversation = $chat::createConversation($participants);
            $botuser = User::findOrFail(6);
            event(new ConversationCreated($conversation));
            $this->doSend($chat, " Private conversation created. Users: ".$user1->name.", ".$user2->name.".", $conversation, $botuser);
            return $conversation->id;
    }
    public function clearConversation($convId){
        if($convId!=1){
            $chat = App::make('Chat');
            $user = Auth::user();
            $conversation = $chat::conversations()->getById($convId);
            $chat::conversation($conversation)->for($user)->clear();
            $chat::conversation($conversation)->removeParticipants($user);
            $botuser = User::findOrFail(6);

            $this->doSend($chat, $user->name." left", $conversation, $botuser);
            echo "OK";
        }
        else{
            echo "Unable to clear and exit main thread";
        }
    }
    public function sendMessage(Request $request){
        $request->input('message') === NULL ? exit() : "";
        $user = Auth::user();
        $chat = App::make('Chat');
        $messageBody = $request->input('message');
        $conversationId = $request->input('conversation');
        $conversation = $chat::conversations()->getById($conversationId);
        
        $this->doSend($chat, $messageBody, $conversation, $user);
    }
    private function doSend($chat, $messageBody, $conversation, $user){
        $message = $chat::message($messageBody)
        ->from($user)
        ->to($conversation)
        ->send();
        event(new MessageSent($message));
    }
}
