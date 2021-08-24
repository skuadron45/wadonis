import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // Route.group(() => {
    //     Route.post('register', 'AuthController.register')
    //     Route.post('login', 'AuthController.login')
    // }).prefix('auth')

    Route.get('events', 'EventsController.index')
    Route.group(() => {
        Route.get('tickets/nocache', 'TicketsController.indexWithoutCache')
        Route.resource('events', 'EventsController').apiOnly().except(['index'])
        Route.resource('tickets', 'TicketsController').apiOnly()
        Route.get('users/:id/events', 'EventsController.userevents')
        Route.post('events/buy/:id', 'EventsController.buy')
        Route.post('events/join/:id', 'EventsController.join')
    }) //.middleware('auth:api')
}).prefix('api/v1')