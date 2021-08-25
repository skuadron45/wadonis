import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
    response.redirect().toRoute('auth.login.index')
}).as("home.index");

Route.group(() => {
    Route.get('/login', "AuthController.index").as("auth.login.index")
    Route.post('/login', "AuthController.attempt").as("auth.login.attempt")
}).prefix('auth');

Route.group(() => {
    Route.get('/logout', "AuthController.logout").as("auth.logout")
}).prefix('auth').middleware('auth')

Route.group(() => {
    Route.get('/dashboard', "DashboardController.index").as("dashboard.index")

    Route.group(() => {
        Route.get('/', "DeviceController.index").as("device.index")
        Route.get('/create', "DeviceController.create").as("device.create")
        Route.get('/qrcode/:id', "DeviceController.qrcode").as("device.qrcode")
        Route.get('/fitur/:id', "DeviceController.fitur").as("device.fitur")
    }).prefix('device')
}).middleware('auth')