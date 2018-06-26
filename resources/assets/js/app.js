
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app'
});


/**
 * Chat code:
 */
$(document).ready(function(){
    window.avatarsCache=[];
    window.cachedelay=0;
    function getAvatar(string, target){
        if(window.avatarsCache[string]==null){
        setTimeout(function(){ 
            if(window.avatarsCache[string]!=null){
                $(target).html(window.avatarsCache[string]);
                window.cachedelay=0;
                console.log("SLOWHIT");
            }
            else{
                $.get( "user/avatar/" + string)
                .done(function( data ) {
                    window.avatarsCache[string]=data;
                    $(target).html(data);
                });
                console.log("MISS");
            }
        }, 50*window.cachedelay);
        window.cachedelay++;
        }
        if(window.avatarsCache[string]!=null){
            $(target).html(window.avatarsCache[string]);
            console.log("FASTHIT");
        }
    }
    function displayMessage(message, conversation, append=false){
        //console.log(message);
        if(conversation!=window.current_conversation){
            $("#unread"+conversation).html(parseInt($val)+1);
            return;
        }
        if(message.user_id == $("input[name=current_user]").val()){
            classInject="user_sent";
            ddtag="";
            
        }
        else{
            classInject="";
            ddtag = '<div class="dropdown conv_create" data-userid="'+message.user_id+'">private</div>';
        }

        if(typeof window.conversations[conversation][message.user_id] != 'undefined'){
            cinj=window.conversations[conversation][message.user_id]
        }
        else{cinj="unknown";}
        userInject='<div class="sender">'+cinj+ddtag+'</div>';
        messagebox='<div class="message '+classInject+'"><div class="avatar" id="msgavt'+message.id+'"></div>'+userInject+" "+message.body+'</div>';
        append ? $(".messages").append(messagebox) : $(".messages").prepend(messagebox);
        getAvatar(window.conversations[conversation][message.user_id],'#msgavt'+message.id);
        $("#messagesHolder").scrollTop($("#messagesHolder")[0].scrollHeight);
    }
    function getMessages(convo_id){
        $.get( "chat/messages/" + convo_id)
        .done(function( data ) {
            //console.log(data);
            //console.log(window.conversations);
            $(".messages").html("");
            data.forEach(function(message){
                displayMessage(message, convo_id);
            });
            $("#unread"+convo_id).html("0");
        });
        
    }
    function getConversations(){
        $.get( "chat/conversations")
        .done(function( conversations ) {
            window.unread=conversations[1];
            $(".conversations").html("");
            conversationsArray=[];
            conversations[0].data.forEach(function(conversation){
                
                var participantsArr=[];
                var participantNames="";
                var participantAvatars="";
                if(conversation.users){
                offset=0;
                conversation.users.forEach(function(user){
                    //console.log(user);
                    participantsArr[user.id]=user.name;
                    participantNames+=user.name+", ";
                    participantAvatars+='<div class="avatar" style="left:'+(offset*2)+'px" id="pavt'+conversation.id+'xc'+user.id+'"></div>';
                    offset++;
                })          
                conversationsArray[conversation.id]=participantsArr;
                }
                else{
                    conversationsArray[conversation.id]=[];
                }
                //$(".conversations").append('<div class="convo">'+conversation.id+'</div>');
                $(".conversations").append('<div class="convoget" data-convo="'+conversation.id+'" class="convo" title="'+participantNames+'">'+participantAvatars+'<div class="unread" id="unread'+conversation.id+'">'+window.unread[conversation.id]+'</div></div>');
                if(conversation.last_message){
                    //console.log(conversation.last_message.body);
                }
                window.conversations=conversationsArray;
                conversation.users.forEach(function(user){
                    getAvatar(user.name,'#pavt'+conversation.id+'xc'+user.id);
                }) 
            })
            getMessages(window.current_conversation);
        });
    }
    function create_conversation($with){
        $.post( "chat/conversation/create/" + $with)
        .done(function(data) {
            window.current_conversation=data;
            getConversations();
        });
    }
    window.current_conversation = 1;
    getConversations();

    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
    });
    $(".send").click(function(){
        $.post( "chat/messages/send", { 
            message: $("input[name=chatMessage]").val(), 
            conversation: window.current_conversation
        })
        .done(function() {
            $("input[name=chatMessage]").val("");
            $("input[name=chatMessage]").focus();
            //getMessages(window.current_conversation);
            //$("#messagesHolder").scrollTop($("#messagesHolder")[0].scrollHeight);
        });
    });
    $(".conv_clear").click(function(){
        $.post( "chat/conversation/clear/" + window.current_conversation)
        .done(function(data) {
            console.log(data);
            if(data=="OK"){
                window.current_conversation=1;
                getConversations();
            }
            else{
                alert(data);
            }
        });
    })
    $( document ).on("click", ".conv_create", function() {
        create_conversation($(this).data("userid"));
    })
    $(document).keypress(function(e){
        if (e.which == 13){
            $(".send").click();
        }
    });
    $( document ).on("click", ".convoget", function() {
        convo_id =  $( this ).data("convo");
        window.current_conversation = convo_id;
        getMessages(convo_id);
        
    });
    // setInterval(function(){ 
    //     getMessages(window.current_conversation);
        
    // }, 3000);

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('dfe5bfc11c27f3fd796b', {
      cluster: 'eu',
      encrypted: false
    });

    var channel = pusher.subscribe('messages');
    channel.bind('App\\Events\\MessageSent', function(data) {
        console.log(data.message);
        //console.log(conversation);
        $val=$("#unread"+data.message.conversation.id).html();
        
        displayMessage(data.message, data.message.conversation_id, true);
      });
    channel.bind('App\\Events\\ConversationCreated', function(conversation) {
        console.log(conversation.users);
        getConversations();
    });
})
