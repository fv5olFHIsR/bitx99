
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



$(document).ready(function(){
    function getMessages(convo_id){
        
        $.get( "/chat/messages/" + convo_id)
        .done(function( data ) {
            $(".messages").html("");
            data.forEach(function(message){
                console.log(message);
                if(message.user_id == $("input[name=current_user]").val()){classInject="user_sent";}
                else{classInject="";}
                $(".messages").append('<div class="message '+classInject+'">'+message.body+'</div>');
            });
        });
    }
    window.current_conversation = 1;
    getMessages(window.current_conversation);
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
    });
    $(".send").click(function(){
        $.post( "/chat/messages/send", { 
            message: $("input[name=chatMessage]").val(), 
            conversation: window.current_conversation
        })
        .done(function( data ) {
            getMessages(window.current_conversation);
        });
    });
    $( document ).on("click", ".convoget", function() {
        convo_id =  $( this ).data("convo");
        window.current_conversation = convo_id;
        getMessages(convo_id);
    });
    $.get( "/chat/conversations")
    .done(function( data ) {
        data.data.forEach(function(conversation){
            //$(".conversations").append('<div class="convo">'+conversation.id+'</div>');
            $(".conversations").append('<div class="convoget" data-convo="'+conversation.id+'" class="convo">'+conversation.id+'</div>');
            if(conversation.last_message){
                //console.log(conversation.last_message.body);
            }
        })
    });
})
