import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', "DashboardController.index").as("home.index")

Route.get('/', async ({ response }) => {
    return "home"
}).as("home.index");


Route.get('/login', async ({ response }) => {
    return "Login Page"
}).as("auth.login");

Route.group(() => {
    Route.get('dashboard', "DashboardController.index").as("dashboard.index")
    Route.group(() => {

        Route.get('/', "DeviceController.index").as("device.index")
        Route.get('create', "DeviceController.create").as("device.create")
        Route.get('qrcode/:id', "DeviceController.qrcode").as("device.qrcode")
        Route.get('fitur/:id', "DeviceController.fitur").as("device.fitur")
    }).prefix('device')
})
// }).middleware('auth')