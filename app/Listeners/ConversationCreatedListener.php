<?php

namespace App\Listeners;

use App\Events\ConversationCreated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ConversationCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ConversationCreated  $event
     * @return void
     */
    public function handle(ConversationCreated $event)
    {
        //
    }
}
