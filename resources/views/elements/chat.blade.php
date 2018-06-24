
<div class="chatContainer">
    <div class="messagesHolder">
        <div class="messages"></div>
        <div class="conversations"></div>
    </div>
    <div class="sendBar">
        <input type="text" name="chatMessage" placeholde="Chat :)"/>
        <div class="btn btn-primary send">Send</div>
    </div>
    <input type="hidden" name="current_user" value="{{ Auth::user()->id }}"/>
</div>