import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {

    public async index({ view, auth, request }: HttpContextContract) {

        let data: any = {};
        return view.render("dashboard/index", data);
    }
}
