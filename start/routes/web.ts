import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
    response.redirect().toRoute('auth.login')
}).as("home.index");

Route.group(() => {
    Route.get('/login', "AuthController.login").as("auth.login")
    Route.post('/login', "AuthController.loginAttempt").as("auth.login.attempt")

    Route.get('/register', "AuthController.register").as("auth.register")
    Route.post('/register', "AuthController.registerAttempt").as("auth.register.attempt")

}).middleware('guest')

Route.group(() => {
    Route.get('/logout', "AuthController.logout").as("auth.logout")
}).middleware('auth')

Route.group(() => {
    Route.get('/dashboard', "DashboardController.index").as("dashboard.index")

    Route.group(() => {
        Route.get('/', "DeviceController.index").as("device.index")
        Route.get('/create', "DeviceController.create").as("device.create")
        Route.get('/qrcode/:id', "DeviceController.qrcode").as("device.qrcode")
        Route.get('/fitur/:id', "DeviceController.fitur").as("device.fitur")
    }).prefix('device')
}).middleware('auth')