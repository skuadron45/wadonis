import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // Route.get('events', 'EventsController.index')    

    // Route.group(() => {
    // Route.resource('tickets', 'TicketsController').apiOnly()
    // Route.get('users/:id/events', 'EventsController.userevents')
    // }).middleware('auth:api')
}).prefix('api/v1')