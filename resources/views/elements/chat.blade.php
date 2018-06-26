
<div class="chatContainer">
    <div class="messagesHolder" id="messagesHolder">
        <div class="conversation_title"><p>Placeholder conversation title</p></div>
        <div class="btn btn-danger conv_clear">CLEAR</div>
        <div class="messages" ></div>
        <div class="conversations"></div>
    </div>
    <div class="sendBar">
        <input type="text" name="chatMessage" placeholde="Chat :)"/>
        <div class="btn btn-primary send">Send</div>
    </div>
    <input type="hidden" name="current_user" value="{{ Auth::user()->id }}"/>
    <input type="hidden" name="current_user_name" value="{{ Auth::user()->name }}"/>
    
</div>